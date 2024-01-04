// routes/thoughtRoutes.js:
const express = require('express');
const thoughtRouter = express.Router();
const { UserThought } = require('../models');

// Get all thoughts
thoughtRouter.get('/thoughts', async (req, res) => {
  try {
    const thoughtsList = await UserThought.find({});
    res.json(thoughtsList);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get a single thought by ID
thoughtRouter.get('/thoughts/:id', async (req, res) => {
  try {
    const singleThought = await UserThought.findById(req.params.id);
    if (!singleThought) {
      return res.status(404).json({ message: 'No thought found with this ID!' });
    }
    res.json(singleThought);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a specific thought
thoughtRouter.put('/thoughts/:id', async (req, res) => {
  try {
    const updatedThought = await UserThought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedThought) {
      res.status(404).json({ message: 'No thought found with this ID!' });
      return;
    }
    res.json(updatedThought);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Create a new thought
thoughtRouter.post('/thoughts', async (req, res) => {
  try {
    const newThought = new UserThought(req.body);
    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Remove a thought from the database
thoughtRouter.delete('/thoughts/:id', async (req, res) => {
  try {
    const deletedThought = await UserThought.findByIdAndDelete(req.params.id);
    if (!deletedThought) {
      res.status(404).json({ message: 'No thought found with this ID!' });
      return;
    }
    res.json({ message: 'Thought successfully deleted.' });
  } catch (error) {
    res.status(400).json(error);
  }
});

// Post a Reaction to a Thought
thoughtRouter.post('/thoughts/:thoughtId/reactions', async (req, res) => {
  try {
    const thoughtWithReaction = await UserThought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    );
    if (!thoughtWithReaction) {
      res.status(404).json({ message: 'No thought found with this ID!' });
      return;
    }
    res.json(thoughtWithReaction);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Delete a Reaction from a Thought
thoughtRouter.delete('/thoughts/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thoughtWithoutReaction = await UserThought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true }
    );
    if (!thoughtWithoutReaction) {
      res.status(404).json({ message: 'No thought found with this ID!' });
      return;
    }
    res.json(thoughtWithoutReaction);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = thoughtRouter;
