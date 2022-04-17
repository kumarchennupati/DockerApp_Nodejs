const mongoose = require('mongoose');
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const Schema = mongoose.Schema;

const userDetails = new Schema({
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




userDetails.plugin(mongooseFieldEncryption, { 
  fields: [ "name","email","department","city","contact"], 
  secret: "mypassword",
  saltGenerator: function (secret) {
    return "1234567890123456"; 
    // should ideally use the secret to return a string of length 16, 
    // default = `const defaultSaltGenerator = secret => crypto.randomBytes(16);`, 
    // see options for more details
  },
});

const usrDetails = mongoose.model('User_Details', userDetails);
module.exports = usrDetails;