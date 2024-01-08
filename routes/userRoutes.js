const express = require('express');
const { User, Thought } = require('../models');

// Create a router instance
const router = express.Router();

// Route to get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a single user by its id with populated thought and friend data
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('thoughts')
      .populate('friends');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update a user by its id
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a user by its id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Delete the user's thoughts
    await Thought.deleteMany({ username: user.username });

    // Now delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and their thoughts deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendId);

    if (!user || !friend) {
      res.status(404).json({ message: 'User or friend not found' });
      return;
    }

    // Prevent adding the same friend twice
    if (user.friends.includes(req.params.friendId)) {
      res.status(400).json({ message: 'Friend already added' });
      return;
    }

    user.friends.push(req.params.friendId);
    await user.save();

    res.json({ message: 'Friend added successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.friends = user.friends.filter(
      (friendId) => friendId.toString() !== req.params.friendId
    );

    await user.save();

    res.json({ message: 'Friend removed successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Export the router
module.exports = router;
