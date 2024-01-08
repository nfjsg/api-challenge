const mongoose = require('mongoose');
const { User, Thought } = require('../models');

async function establishDatabaseConnection() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/socialNetworkDB');
    console.log('Successfully connected to the database');
  } catch (error) {
    console.error('Failed to establish a connection to the database:', error.message);
  }
}

const usersData = [
  {
    username: 'AdventureSeeker23',
    email: 'Seeker@example.com',
    thoughts: [],
    friends: [],
  },
  {
    username: 'TechEnthusiast',
    email: 'TechFan@example.com',
    thoughts: [],
    friends: [],
  },
  {
    username: 'NatureExplorer',
    email: 'Explorer@example.com',
    thoughts: [],
    friends: [],
  },
];

const thoughtsData = [
  {
    thoughtText: 'Expressing my passion for adventurous activities.',
    username: 'AdventureSeeker23',
    reactions: [],
  },
  {
    thoughtText: 'Exploring the wonders of technology.',
    username: 'TechEnthusiast',
    reactions: [],
  },
  {
    thoughtText: 'Appreciating the beauty of nature.',
    username: 'NatureExplorer',
    reactions: [],
  },
];

async function seedDatabaseEntries() {
  try {
    await User.deleteMany({});
    await Thought.deleteMany({});
    await User.insertMany(usersData);
    await Thought.insertMany(thoughtsData);
    console.log('Database entries successfully seeded!');
  } catch (error) {
    console.error('Error while seeding the database entries:', error.message);
  }
}

async function concludeDatabaseConnection() {
  try {
    await mongoose.connection.close();
    console.log('Database connection successfully closed');
  } catch (error) {
    console.error('Error while closing the database connection:', error.message);
  }
}

async function seedAndConclude() {
  await establishDatabaseConnection();
  await seedDatabaseEntries();
  await concludeDatabaseConnection();
}

seedAndConclude();
