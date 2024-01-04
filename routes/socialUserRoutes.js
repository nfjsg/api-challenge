// routes/userRoutes.js:
const express = require('express');
const userRouter = express.Router();
const mongoose = require('mongoose');
const { SocialUser } = require('../models');

// Get all users
userRouter.get('/users', async (req, res) => {
  try {
    const userList = await SocialUser.find({});
    res.json(userList);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get a single user by ID
userRouter.get('/users/:id', async (req, res) => {
  try {
    const singleUser = await SocialUser.findById(req.params.id);
    if (!singleUser) {
      res.status(404).json({ message: 'No user found with this ID!' });
      return;
    }
    res.json(singleUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create a new user
userRouter.post('/users', async (req, res) => {
  if (!req.body.username || !req.body.email) {
    res.status(400).json({ message: 'Username and email are required.' });
    return;
  }
  try {
    const newUser = new SocialUser(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Add a friend to a user's friend list
userRouter.post('/users/:userId/friends/:friendId', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId) || !mongoose.Types.ObjectId.isValid(req.params.friendId)) {
    res.status(400).json({ message: 'Invalid userId or friendId.' });
    return;
  }

  if (req.params.userId === req.params.friendId) {
    res.status(400).json({ message: 'Users cannot add themselves as a friend.' });
    return;
  }

  try {
    // Check if the friend exists
    const friendExists = await SocialUser.exists({ _id: req.params.friendId });
    if (!friendExists) {
      res.status(404).json({ message: 'Friend to add not found.' });
      return;
    }

    const user = await SocialUser.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ message: 'No user found with this userId!' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Update a user by ID
userRouter.put('/users/:id', async (req, res) => {
  if (req.body.username === '' || req.body.email === '') {
    res.status(400).json({ message: 'Username and email cannot be empty.' });
    return;
  }
  try {
    const updatedUser = await SocialUser.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedUser) {
      res.status(404).json({ message: 'No user found with this ID!' });
      return;
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Remove a user by ID
userRouter.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await SocialUser.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      res.status(404).json({ message: 'No user found with this ID!' });
      return;
    }
    res.json({ message: 'User successfully deleted.' });
  } catch (error) {
    res.status(400).json(error);
  }
});

// Remove a friend from a user's friend list
userRouter.delete('/users/:userId/friends/:friendId', async (req, res) => {
  try {
    const userWithoutFriend = await SocialUser.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    if (!userWithoutFriend) {
      res.status(404).json({ message: 'No user found with this userId!' });
      return;
    }
    res.json(userWithoutFriend);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = userRouter;
