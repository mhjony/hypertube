import nodemailer from "nodemailer";

export const resetEmail = (email, token) => {
  console.log(`Sending email to ${email}`);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // type: 'OAuth2',
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASS,
      // clientId: appClientId,
      // clientSecret: appClientSecret,
      // refreshToken: appRefreshToken
    },
  });

  const mailOptions = {
    from: "hive.web.branch@gmail.com",
    to: email,
    subject: "Reset Your Password",
    text: `Forgot Your Password? That's okay! you can reset your password by clicking following link: http://localhost:3000/resetPassword?token=${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
