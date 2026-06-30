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

// RFC 2047 — evita caracteres no-ASCII corruptos en el asunto del email
const encodeSubject = (text) =>
  `=?UTF-8?B?${Buffer.from(text, 'utf8').toString('base64')}?=`;

const buildRawEmail = ({ from, to, subject, html, replyTo }) => {
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    `Reply-To: ${replyTo}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: quoted-printable',
    '',
    html,
  ];
  return Buffer.from(lines.join('\r\n')).toString('base64url');
};

const sendContactNotification = async ({ name, company, email, phone, service, message }) => {
  const adminEmail = process.env.EMAIL_ADMIN || 'jorge.arias.amauta@gmail.com';
  const senderEmail = process.env.GMAIL_USER || 'jorge.arias.amauta@gmail.com';

  const now = new Date().toLocaleString('es-EC', {
    timeZone: 'America/Guayaquil',
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const row = (label, value) =>
    value
      ? `<tr>
           <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;width:130px">${label}</td>
           <td style="padding:12px 16px;font-size:15px;color:#e2e8f0;border-left:1px solid #1e293b">${value}</td>
         </tr>`
      : '';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Nuevo contacto — JAV LABS</title>
</head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:32px 16px">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d1b2a 0%,#1a1040 100%);border-radius:12px 12px 0 0;padding:32px 40px;border-bottom:2px solid #7c3aed">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:3px;color:#7c3aed;text-transform:uppercase">JAV LABS</p>
                    <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff">Nuevo mensaje de contacto</h1>
                  </td>
                  <td align="right" style="vertical-align:top">
                    <span style="display:inline-block;background:#7c3aed22;border:1px solid #7c3aed55;border-radius:20px;padding:6px 14px;font-size:12px;color:#a78bfa;font-weight:600">Formulario Web</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- NOMBRE DESTACADO -->
          <tr>
            <td style="background:#0f172a;padding:28px 40px 20px">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;color:#64748b;text-transform:uppercase">De parte de</p>
              <h2 style="margin:0;font-size:26px;font-weight:700;color:#f8fafc">${name}</h2>
              ${company ? `<p style="margin:6px 0 0;font-size:14px;color:#94a3b8">${company}</p>` : ''}
            </td>
          </tr>

          <!-- TABLA DE DATOS -->
          <tr>
            <td style="background:#0f172a;padding:0 40px 24px">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1e293b;border-radius:8px;overflow:hidden">
                ${row('Email', `<a href="mailto:${email}" style="color:#60a5fa;text-decoration:none">${email}</a>`)}
                ${row('Teléfono', phone ? `<a href="tel:${phone}" style="color:#60a5fa;text-decoration:none">${phone}</a>` : null)}
                ${row('Servicio', service)}
              </table>
            </td>
          </tr>

          <!-- MENSAJE -->
          <tr>
            <td style="background:#0f172a;padding:0 40px 32px">
              <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:2px;color:#64748b;text-transform:uppercase">Mensaje</p>
              <div style="background:#0d1b2a;border-left:3px solid #7c3aed;border-radius:0 8px 8px 0;padding:16px 20px">
                <p style="margin:0;font-size:15px;color:#cbd5e1;line-height:1.7;white-space:pre-wrap">${message}</p>
              </div>
            </td>
          </tr>

          <!-- ACCIONES -->
          <tr>
            <td style="background:#0f172a;padding:0 40px 32px">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:12px">
                    <a href="mailto:${email}?subject=Re: Tu consulta en JAV LABS" style="display:inline-block;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px">Responder ahora</a>
                  </td>
                  ${phone ? `<td>
                    <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display:inline-block;background:#065f46;color:#6ee7b7;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px">WhatsApp</a>
                  </td>` : ''}
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#060c18;border-radius:0 0 12px 12px;padding:20px 40px;border-top:1px solid #1e293b">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:#475569">Recibido el ${now} (Ecuador)</p>
                    <p style="margin:4px 0 0;font-size:12px;color:#334155">Formulario de contacto &mdash; javlabsautomatic.com</p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;color:#334155">JAV LABS</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const gmail = getGmailClient();
  const raw = buildRawEmail({
    from: `"JAV LABS" <${senderEmail}>`,
    to: adminEmail,
    subject: 'Cliente Interesado javlabs',
    html,
    replyTo: email,
  });

  await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
  logger.info(`Email enviado a ${adminEmail} por contacto de ${email}`);
};

module.exports = { sendContactNotification };
