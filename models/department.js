const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const depDetails = new Schema({
    name: {
      type: String,
      required: true,
    }
});

const department = mongoose.model('departments', depDetails);
module.exports = department;