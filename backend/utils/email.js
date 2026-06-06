const nodemailer = require('nodemailer');

const createTransporter = () => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    EMAIL_FROM
  } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM) {
    throw new Error(
      'Email is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM in backend/.env'
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // common default for SMTPS
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    }
  });
};

const sendMail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  const { EMAIL_FROM } = process.env;

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    html
  });

  return info;
};

module.exports = { sendMail };

