const express = require('express');
const { protect } = require('../middleware/middleAuth.cjs');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  deleteComment
} = require('../controllers/postController.cjs');

// Post routes
router.post('/', protect, createPost);
router.get('/', getAllPosts);
router.get('/user/:username', getUserPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

// Comment routes /
router.post('/:id/comments', protect, addComment);
router.delete('/:postId/comments/:commentId', protect, deleteComment);

module.exports = router;