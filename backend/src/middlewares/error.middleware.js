const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} — ${req.method} ${req.path}`);

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor único.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Registro no encontrado.' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Error interno del servidor.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
