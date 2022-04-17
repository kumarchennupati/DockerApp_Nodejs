const mongoose = require('mongoose');
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const Schema = mongoose.Schema;

const loginApproval = new Schema({
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

loginApproval.plugin(mongooseFieldEncryption, { 
  fields: ["role"], 
  secret: "mypassword",
  saltGenerator: function (secret) {
    return "1234567890123456"; 

  },
});

const approvalLogin = mongoose.model('Approval_Login_Details', loginApproval);
module.exports = approvalLogin;