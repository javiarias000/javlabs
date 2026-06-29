require('dotenv').config();
const app = require('./app');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 JAV LABS API corriendo en puerto ${PORT} [${process.env.NODE_ENV}]`);
  logger.info(`DATABASE_URL: ${process.env.DATABASE_URL ? 'SET ✅' : 'NOT FOUND ❌'}`);
  logger.info(`GMAIL_USER: ${process.env.GMAIL_USER ? 'SET ✅' : 'NOT FOUND ❌'}`);
  logger.info(`GMAIL_REFRESH_TOKEN: ${process.env.GMAIL_REFRESH_TOKEN ? 'SET ✅' : 'NOT FOUND ❌'}`);
  logger.info(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? 'SET ✅' : 'NOT FOUND ❌'}`);
});