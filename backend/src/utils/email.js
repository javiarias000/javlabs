const { google } = require('googleapis');
const { logger } = require('./logger');

const getGmailClient = () => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

const buildRawEmail = ({ from, to, subject, html, replyTo }) => {
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Reply-To: ${replyTo}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    html,
  ];
  return Buffer.from(lines.join('\r\n')).toString('base64url');
};

const sendContactNotification = async ({ name, company, email, phone, service, message }) => {
  const adminEmail = process.env.EMAIL_ADMIN || 'jorge.arias.amauta@gmail.com';
  const senderEmail = process.env.GMAIL_USER || 'jorge.arias.amauta@gmail.com';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a2e; border-bottom: 2px solid #e94560; padding-bottom: 8px;">
        Nuevo contacto desde JAV LABS
      </h2>
      <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding: 8px; font-weight: bold; color: #555;">Nombre</td><td style="padding: 8px;">${name}</td></tr>
        <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold; color: #555;">Email</td><td style="padding: 8px;">${email}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #555;">Empresa</td><td style="padding: 8px;">${company || '—'}</td></tr>
        <tr style="background:#f9f9f9"><td style="padding: 8px; font-weight: bold; color: #555;">Teléfono</td><td style="padding: 8px;">${phone || '—'}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; color: #555;">Servicio</td><td style="padding: 8px;">${service || '—'}</td></tr>
      </table>
      <div style="margin-top: 16px; padding: 12px; background: #f0f0f0; border-left: 4px solid #e94560;">
        <strong style="color: #555;">Mensaje:</strong>
        <p style="margin: 8px 0 0; white-space: pre-wrap;">${message}</p>
      </div>
      <p style="margin-top: 24px; font-size: 12px; color: #aaa;">
        Enviado desde el formulario de contacto de javlabsautomatic.com
      </p>
    </div>
  `;

  const gmail = getGmailClient();
  const raw = buildRawEmail({
    from: `"JAV LABS" <${senderEmail}>`,
    to: adminEmail,
    subject: `Nuevo contacto: ${name} — ${service || 'sin servicio'}`,
    html,
    replyTo: email,
  });

  await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
  logger.info(`Email enviado a ${adminEmail} por contacto de ${email}`);
};

module.exports = { sendContactNotification };
