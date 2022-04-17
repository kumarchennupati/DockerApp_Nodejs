const mongoose = require('mongoose');
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const Schema = mongoose.Schema;

const userApproval = new Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },

}, { timestamps: true });


userApproval.plugin(mongooseFieldEncryption, { 
  fields: [ "name","email","department","city","contact"], 
  secret: "mypassword",
  saltGenerator: function (secret) {
    return "1234567890123456"; 
  },
});


const approvalUser = mongoose.model('approval_User_Details', userApproval);
module.exports = approvalUser;