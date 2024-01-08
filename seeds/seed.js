const mongoose = require('mongoose');
const { User, Thought } = require('../models');

mongoose.connect('mongodb://127.0.0.1:27017/socialNetworkDB');

const user = [
  {
    username: 'Slippery Pete',
    email: 'Pete@example.com',
    thoughts: [],
    friends: [],
  },
  {
    username: 'Wayne',
    email: 'Wayne@example.com',
    thoughts: [],
    friends: [],
  },
  {
    username: 'Nova',
    email: 'Nova@example.com',
    thoughts: [],
    friends: [],
  },
];

const thoughts = [
  {
    thoughtText: 'I really like playing frisbee.',
    username: 'Slippery Pete',
    reactions: [],
  },
  {
    thoughtText: 'Eating random stuff on the ground is the best.',
    username: 'Wayne',
    reactions: [],
  },
  {
    thoughtText: 'I like playing tug of war.',
    username: 'Nova',
    reactions: [],
  },
];

const seedDB = async () => {
  await User.deleteMany({});
  await Thought.deleteMany({});
  await User.insertMany(user);
  await Thought.insertMany(thoughts);
  console.log('Database seeded!');
};

seedDB().then(() => {
  mongoose.connection.close();
});
