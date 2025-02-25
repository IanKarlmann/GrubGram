const express = require('express');
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
router.post('/', createPost);
router.get('/', getAllPosts);
router.get('/user/:username', getUserPosts);
router.get('/:id', getPostById);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

// Comment routes /
router.post('/:id/comments', addComment);
router.delete('/:postId/comments/:commentId', deleteComment);

module.exports = router;