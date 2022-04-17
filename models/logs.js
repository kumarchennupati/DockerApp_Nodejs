const mongoose = require('mongoose');
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
const Schema = mongoose.Schema;

const logDetails = new Schema({
  username: {
    type: String,
    required: true,
  },
  command: {
    type: String,
    required: true
  },

}, { timestamps: true });




logDetails.plugin(mongooseFieldEncryption, { 
  fields: [ "username","command"], 
  secret: "mypassword",
  saltGenerator: function (secret) {
    return "1234567890123456"; 
  },
});

const logs = mongoose.model('logs', logDetails);
module.exports = logs;