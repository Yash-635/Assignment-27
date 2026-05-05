const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

// GET /users -> fetch users with their posts
router.get('/', async (req, res) => {
  try {
    const users = await User.find().lean();
    for (let u of users) {
        u.posts = await Post.find({ user: u._id });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /users -> create user
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const user = new User({ name });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /users/:userId/posts -> create post for a user
router.post('/:userId/posts', async (req, res) => {
  try {
    const { title } = req.body;
    const { userId } = req.params;
    const post = new Post({ title, user: userId });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /users/:userId -> fetch single user with posts
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.posts = await Post.find({ user: user._id });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /users/:userId -> update user
router.put('/:userId', async (req, res) => {
  try {
    const { name } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { name },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /users/:userId -> delete user and related posts
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    // Delete all posts by this user
    await Post.deleteMany({ user: userId });
    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    res.json({ message: 'User and related posts deleted', deletedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /users/:userId/posts/:postId -> delete post
router.delete('/:userId/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const deletedPost = await Post.findByIdAndDelete(postId);
    res.json({ message: 'Post deleted', deletedPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /users/:userId/posts/:postId -> update post
router.put('/:userId/posts/:postId', async (req, res) => {
  try {
    const { title } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { title },
      { new: true }
    );
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
