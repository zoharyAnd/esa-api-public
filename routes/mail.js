const express = require('express');
const router = express.Router();
require("dotenv").config();
var nodemailer = require('nodemailer'); 

var transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

router.post('/contact', async function(req, res, next) {
  
  try {
    const mailOptions = {
      from: req.body.email,
      to: process.env.EMAIL_USERNAME,
      subject: req.body.object,
      html: `
        <h3>Message from ${req.body.firstName} ${req.body.lastName}</h3>
        <p>${req.body.message}</p>
      `,
    };

    await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        res.json({message: "An error occured when sending your email", status: 400, error });
      } else {
        res.json({ message: `Email successfully sent to: ${process.env.EMAIL_USERNAME}`, status: 200});
      }
    });

  } catch (err) {
    console.error(`Error while sending email:`, err.message);
    next(err);
  }
  
});

module.exports = router;