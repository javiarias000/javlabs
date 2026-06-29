const nodemailer = require('nodemailer');
const { logger } = require('./logger');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendContactNotification = async ({ name, company, email, phone, service, message }) => {
  const adminEmail = process.env.EMAIL_ADMIN || 'jorge.arias.amauta@gmail.com';

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
        Enviado desde el formulario de contacto de javlabs.com
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"JAV LABS" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `Nuevo contacto: ${name} — ${service || 'sin servicio'}`,
    html,
    replyTo: email,
  });

  logger.info(`Email de notificación enviado a ${adminEmail} por contacto de ${email}`);
};

module.exports = { sendContactNotification };
