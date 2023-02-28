var nodemailer = require("nodemailer");


const mail1 = function(otp) {

  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
  
  service: 'gmail',
  
  tls:{rejectUnauthorized:false},
  
  auth: {
  
  user: 'SENDER_MAIL_USERNAME',
  
  pass: 'SENDER_MAIL_PASSWORD'
  
  }
  
  });
  
  var mailOptions = {
  
  from: 'SENDER_MAIL',
  
  to: 'RECEIVER_mAIL',
  
  subject: 'verifify your account',
  
  text: 'please enter the fallowing verification code to get registered: '+otp
  
  };
  
  
  transporter.sendMail(mailOptions, function (error, info) {
  
  if (error) {
  
  console.log(error);
  
  } else {
  
  console.log('Email sent: ' + info.response);

  
  }
  
  });


}


module.exports = {
  mail1
}

