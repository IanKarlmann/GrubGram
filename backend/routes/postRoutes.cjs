const express = require('express');
const { protect } = require('../middleware/middleAuth.cjs');
const upload = require('../middleware/uploadMiddleware.cjs'); // Import Multer middleware
const {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
} = require('../controllers/postController.cjs');

const router = express.Router();

module.exports = (io) => {
  // Post routes
  router.post('/', protect, upload.single('image'), (req, res) => createPost(req, res, io)); // Add Multer middleware for image upload
  router.get('/', getAllPosts);
  router.get('/user/:username', getUserPosts);
  router.get('/:id', getPostById);
  router.put('/:id', protect, updatePost);
  router.delete('/:id', protect, deletePost);

  // Comment routes
  router.post('/:id/comments', protect, addComment);
  router.delete('/:postId/comments/:commentId', protect, deleteComment);

  return router;
};