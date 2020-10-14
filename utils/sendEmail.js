const nodemailer = require('nodemailer');
const {
  SMTP_EMAIL,
  SMTP_HOST,
  SMTP_PASSWORD,
  SMTP_PORT,
  FROM_EMAIL,
  FROM_NAME,
} = require('../config/dev');

const sendEmail = async (options) => {
  // create reusable transporter object using the default SMTP transport
  //console.log(process.env);

  let transporter = nodemailer.createTransport({
    service: 'gmail',

    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });
  let message = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
