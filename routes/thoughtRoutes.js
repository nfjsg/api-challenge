const express = require('express');
const { Thought, User } = require('../models');

// Create a router instance
const router = express.Router();

// Route to get all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.json(thoughts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get a single thought by its id
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(thought);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to create a new thought
router.post('/', async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: newThought._id },
    });
    res.json(newThought);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to update a thought by its id
router.put('/:id', async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedThought);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to delete a thought by its id
router.delete('/:id', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id);
    if (!deletedThought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json({ message: 'Thought deleted successfully', deletedThought });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to add a reaction to a thought
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    );

    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json({ message: 'Reaction added successfully', thought });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to remove a reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json({ message: 'Reaction removed successfully', thought });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the router
module.exports = router;
