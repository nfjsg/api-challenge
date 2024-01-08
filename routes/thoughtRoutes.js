const router = require('express').Router();
const { Thought, User } = require('../models');

//GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find({});
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET a single thought by its id
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

//POST to create a new thought
router.post('/', async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);
    await User.findByIdAndUpdate(req.body.userId, {
      $push: { thoughts: newThought._id },
    });
    res.json(newThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

//PUT to update a thought by its id
router.put('/:id', async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE to remove a thought by its id
router.delete('/:id', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.id);
    if (!deletedThought) {
      return res
        .status(404)
        .json({ message: 'No thought found with this id!' });
    }
    res.json({ message: 'Thought successfully deleted', deletedThought });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting thought', error: err });
  }
});

//POST to create a reaction stored in a single thought's reactions array
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    );

    if (!thought) {
      return res
        .status(404)
        .json({ message: 'No thought found with this id!' });
    }
    res.json({ message: 'Reaction added successfully', thought });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error adding reaction', error: err.message });
  }
});

//DELETE to pull and remove a reaction by the reaction's id value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );
    if (!thought) {
      return res
        .status(404)
        .json({ message: 'No thought found with this id!' });
    }
    res.json({ message: 'Reaction removed successfully', thought });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error removing reaction', error: err.message });
  }
});

module.exports = router;
