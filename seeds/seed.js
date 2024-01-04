const mongoose = require('mongoose');
const { User, Thought } = require('../models');

// Establish a connection to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/socialNetworkDB');

// Sample user data
const sampleUserData = [
  { username: 'GreenFrog', email: 'greenfrog@example.com', thoughts: [], friends: [] },
  { username: 'PiggyLover', email: 'piggylover@example.com', thoughts: [], friends: [] },
  { username: 'GonzoFanatic', email: 'gonzofanatic@example.com', thoughts: [], friends: [] },
  { username: 'FozzieFan', email: 'fozziefan@example.com', thoughts: [], friends: [] },
  { username: 'WildAnimal', email: 'wildanimal@example.com', thoughts: [], friends: [] },
  // Add more users if needed
];

// Sample thought data
const sampleThoughtData = [
  { thoughtText: 'Embracing my green self today.', username: 'GreenFrog', reactions: [] },
  { thoughtText: 'Finding joy in the warmth of a puppy.', username: 'PiggyLover', reactions: [] },
  { thoughtText: 'Creating Gonzo’s Royal Flush masterpiece!', username: 'GonzoFanatic', reactions: [] },
  { thoughtText: 'Spreading laughter with a Wocka Wocka!', username: 'FozzieFan', reactions: [] },
  { thoughtText: 'Lost in the rhythm of DRUMS DRUMS DRUMS!', username: 'WildAnimal', reactions: [] },
  // Add more thoughts if needed
];

// Function to seed the database with sample data
const seedDatabase = async () => {
  // Clear existing data
  await User.deleteMany({});
  await Thought.deleteMany({});

  // Insert sample users into the User collection
  const insertedUsers = await User.insertMany(sampleUserData);

  // Build a map of usernames to their respective IDs
  const userMap = insertedUsers.reduce((map, user) => {
    map[user.username] = user._id;
    return map;
  }, {});

  // Establish friendships (bi-directional relationships)
  const frogFriends = [userMap['PiggyLover'], userMap['FozzieFan']];
  const piggyFriends = [userMap['GreenFrog'], userMap['WildAnimal']];
  // Add friends to other users as needed

  await User.findByIdAndUpdate(userMap['GreenFrog'], { $addToSet: { friends: { $each: frogFriends } } });
  await User.findByIdAndUpdate(userMap['PiggyLover'], { $addToSet: { friends: { $each: piggyFriends } } });
  // Update friends for other users as needed

  // Map thoughts to corresponding users and insert into the Thought collection
  const thoughts = sampleThoughtData.map(thought => {
    if (userMap[thought.username]) {
      thought = { ...thought, user: userMap[thought.username] };
    }
    return thought;
  });

  await Thought.insertMany(thoughts);

  console.log('Database seeded!');
  process.exit(0);
};

// Call the seedDatabase function to populate the database
seedDatabase();
