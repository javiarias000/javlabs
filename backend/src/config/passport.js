const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const prisma = require('./prisma');
const bcrypt = require('bcryptjs');

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) return done(new Error('No email from Google'), null);

        // Buscar usuario existente
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          // Crear usuario nuevo con contraseña aleatoria (nunca la usará)
          const randomPass = await bcrypt.hash(Math.random().toString(36), 12);
          user = await prisma.user.create({
            data: {
              name:    profile.displayName || email.split('@')[0],
              email,
              password: randomPass,
              company: profile._json?.hd || null, // dominio corporativo si existe
            },
          });
        }

        if (!user.isActive) {
          return done(null, false, { message: 'Cuenta desactivada.' });
        }

        return done(null, user);

      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// No usamos sesiones de passport, solo JWT
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;