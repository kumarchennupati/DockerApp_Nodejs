const mongoose = require('mongoose');
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const Schema = mongoose.Schema;

const loginDet = new Schema({
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true
    },
    securityAnswer: {
      type: String,
      required: true
    },
    role: { type: String, default: 'None' },
  }, { timestamps: true });

  loginDet.plugin(mongooseFieldEncryption, { 
    fields: ["role"], 
    secret: "mypassword",
    saltGenerator: function (secret) {
      return "1234567890123456"; 

    },
  });
  

const login = mongoose.model('login_Details', loginDet);
module.exports = login;