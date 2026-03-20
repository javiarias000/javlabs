const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { logger } = require('../utils/logger');

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// 🔧 Helper para setear la cookie del refreshToken con el path correcto
const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    // ✅ FIX: el path debe coincidir con la ruta real del endpoint
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
  });
};

// ================= REGISTER =================
const register = async (req, res, next) => {
  try {
    let { name, email, password, company, phone } = req.body;

    email = email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'El email ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, company, phone },
      select: { id: true, name: true, email: true, role: true, company: true },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setRefreshCookie(res, refreshToken);

    logger.info(`Nuevo usuario: ${email}`);

    res.status(201).json({ user, accessToken });

  } catch (err) {
    next(err);
  }
};

// ================= LOGIN =================
const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { password: _, ...userSafe } = user;

    setRefreshCookie(res, refreshToken);

    logger.info(`Login: ${email}`);

    res.json({ user: userSafe, accessToken });

  } catch (err) {
    next(err);
  }
};

// ================= REFRESH =================
const refresh = async (req, res, next) => {
  try {
    // ✅ FIX: acepta el token tanto desde cookie como desde el body
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Token requerido.' });
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Token inválido o expirado.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido.' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    // Rotación del token
    await prisma.refreshToken.delete({ where: { token: refreshToken } });

    const tokens = generateTokens(user.id, user.role);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setRefreshCookie(res, tokens.refreshToken);

    // ✅ También devolvemos el refreshToken en el body para clientes que no usan cookies
    res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

  } catch (err) {
    next(err);
  }
};

// ================= LOGOUT =================
const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    res.clearCookie('refreshToken', { path: '/api/auth/refresh' });

    res.json({ message: 'Sesión cerrada.' });

  } catch (err) {
    next(err);
  }
};

// ================= ME =================
const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true, name: true, email: true, role: true,
        company: true, phone: true, createdAt: true,
      },
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ================= GOOGLE CALLBACK =================
// Llamado después de que Passport valida el usuario de Google
const googleCallback = async (req, res, next) => {
  try {
    const user = req.user; // viene de passport

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setRefreshCookie(res, refreshToken);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // ✅ Redirige al frontend con el accessToken en la URL (lo captura GoogleCallback page)
    res.redirect(`${frontendUrl}/auth/google/callback?token=${accessToken}&refresh=${refreshToken}`);

  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, logout, me, googleCallback };