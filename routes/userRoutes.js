const router = require('express').Router();
const { User, Thought } = require('../models');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET a single user by its id and populated thought and friend data
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('thoughts')
      .populate('friends');
    if (!user) {
      res.status(404).json({ message: 'No user found with this id!' });
      return;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//POST a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//PUT to update a user by its id
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE to remove user by its id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'No user found with this id!' });
    }

    //Delete the user's thoughts
    await Thought.deleteMany({ username: user.username });

    //Now delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and their thoughts successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting use', error: err.message });
  }
});

//POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendsId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friend = await User.findById(req.params.friendsId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User or friend not found' });
    }

    //Prevent adding the same friend twice
    if (user.friends.includes(req.params.friendId)) {
      return res.status(400).json({ message: 'Friend already added' });
    }

    user.friends.push(req.params.friendsId);
    await user.save();

    res.json({ message: 'Friend added successfully', user });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: err.message });
  }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.friends = user.friends.filter(
      (friendId) => friendId.toString() !== req.params.friendId
    );

    await user.save();

    res.json({ message: 'Friend removed successfully', user });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
