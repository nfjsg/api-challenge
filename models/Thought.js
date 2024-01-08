const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

// Define the schema for Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Default to the current timestamp when a new thought is created
      get: (timestamp) => new Date(timestamp).toLocaleString(), // Convert timestamp to a readable string when retrieving data
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema], // Embed the Reaction schema for handling reactions
  },
  {
    toJSON: {
      getters: true,
    },
    id: false, // Exclude the auto-generated id field from the JSON representation
  }
);

// Create a virtual property 'reactionCount' that retrieves the length of the thought's reactions array field
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

// Create the Thought model using the defined schema
const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
