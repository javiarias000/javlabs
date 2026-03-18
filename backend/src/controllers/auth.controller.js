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

// ================= REGISTER =================
const register = async (req, res, next) => {
  try {
    let { name, email, password, company, phone } = req.body;

    email = email.toLowerCase(); // 🔥 importante

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'El email ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        company,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
      },
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.role);

    // guardar refresh en DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 🔥 cookie segura
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    logger.info(`Nuevo usuario: ${email}`);

    res.status(201).json({
      user,
      accessToken,
    });

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

    // 🔥 cookie segura
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    logger.info(`Login: ${email}`);

    res.json({
      user: userSafe,
      accessToken,
    });

  } catch (err) {
    next(err);
  }
};

// ================= REFRESH =================
const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado.' });
    }

    // eliminar token anterior (rotación)
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    const tokens = generateTokens(user.id, user.role);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // nueva cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth/refresh',
    });

    res.json({
      accessToken: tokens.accessToken,
    });

  } catch (err) {
    next(err);
  }
};

// ================= LOGOUT =================
const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    // limpiar cookie
    res.clearCookie('refreshToken', {
      path: '/auth/refresh',
    });

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
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        phone: true,
        createdAt: true,
      },
    });

    res.json(user);

  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, logout, me };