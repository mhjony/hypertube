import nodemailer from "nodemailer";
require("dotenv").config();
// const nodemailer = require("nodemailer");

export const sendEmail = (email, token) => {
  console.log(`Sending email to ${email}`);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // user: 'hive.web.branch',
      // pass: 'hive.web.branch93'
      //   type: 'OAuth2',
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASS,
      //   clientId: appClientId,
      //   clientSecret: appClientSecret,
      //   refreshToken: appRefreshToken
    },
  });
  const mailOptions = {
    from: "hive.web.branch@gmail.com",
    to: email,
    subject: "Activate Your Hypertube Account Now",
    text: `Hello! Here is your account activation link. Please click the link to verify your account: http://localhost:8000/auth/registrationVerify?token=${token}`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
