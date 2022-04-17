const mongoose = require('mongoose');
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const Schema = mongoose.Schema;

const userDeletedDetails = new Schema({
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




userDeletedDetails.plugin(mongooseFieldEncryption, { 
  fields: [ "name","email","department","city","contact"], 
  secret: "mypassword",
  saltGenerator: function (secret) {
    return "1234567890123456"; 
  },
});




const deletedUsrDetails = mongoose.model('deleted_User_Details', userDeletedDetails);
module.exports = deletedUsrDetails;