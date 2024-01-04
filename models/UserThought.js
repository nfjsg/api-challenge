// models/UserThought.js.js:
const mongoose = require('mongoose');
const userReactionSchema = require('./UserReaction');

// Define the schema for user thoughts
const userThoughtSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280, // Customize as necessary
  },
  createdOn: {
    type: Date,
    default: Date.now,
    // Include a getter method to format the date if needed
  },
  author: {
    type: String,
    required: true,
  },
  reactions: [userReactionSchema] // Array of user reactions
});

const UserThought = mongoose.model('UserThought', userThoughtSchema);

module.exports = UserThought;
