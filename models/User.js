// models/User.js:
const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the schema for user data
const userSchema = new Schema({
  handle: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match a valid email address!'],
  },
  userThoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'UserThought',
    },
  ],
  connections: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
},
{
  toJSON: {
    virtuals: true,
  },
  _id: false, // Disable automatic generation of _id
});

// Define a virtual property to get the count of friends
userSchema.virtual('friendCount').get(function () {
  return this.connections.length;
});

const SocialUser = mongoose.model('SocialUser', userSchema);

module.exports = SocialUser;
