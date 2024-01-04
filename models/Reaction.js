// models/Reaction.js:
const mongoose = require('mongoose');

// Define the schema for user reactions
const userReactionSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    maxlength: 280 // Customize as necessary
  },
  author: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
    // Include a getter method to format the date if needed
  }
}, {
  toJSON: {
    getters: true
  },
  _id: false // Disable automatic generation of _id
});

module.exports = userReactionSchema;
