const nodemailer = require('nodemailer');

const sendForgotPassword = async (user) => {
  //configure nodemailer
  const transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_APP_PASS,
    },
  });
  const emailUrl = `${process.env.ORIGIN}/resetpass?token=${user.passwordForgotString}&email=${user.email}`;
  const mailOptions = {
    from: 'baqiresfandiari74@gmail.com',
    to: user.email,
    subject: 'Forgot password',
    html: `<p>click on the link to reset your password : <a href="${emailUrl}">Reset Password</a></p>`,
  };
  try {
    const info = await transport.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new CustomError('Email Faild', 500);
  }
};

module.exports = { sendForgotPassword };
