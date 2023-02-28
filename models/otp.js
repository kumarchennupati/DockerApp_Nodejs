const mongoose = require('mongoose');
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const Schema = mongoose.Schema;

const otpDet = new Schema({
    otp: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, expires: '3m', default: Date.now }
  });

  otpDet.plugin(mongooseFieldEncryption, { 
    fields: ["otp"], 
    secret: "mypassword",
    saltGenerator: function (secret) {
      return "1234567890123456"; 

    },
  });
  

const otpDB = mongoose.model('OTP', otpDet);
module.exports = otpDB;