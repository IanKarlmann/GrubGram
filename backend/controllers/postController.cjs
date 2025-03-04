const User = require("../models/User.cjs");
const Post = require("../models/Posts.cjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

// functions:
// findbyId: mongoDB function to find user by ID
// findbyIdAndUpdate / findbyIdAndDelete also mongoDB functions that do similiar things

// countDocuments: counts the number of documents in the collection



// Create a new post
const createPost = async (req, res) => {
  try {
    // Get auth token from request headers
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token (assuming your token has userId stored)
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //test
    // const user = {
    //   _id: new mongoose.Types.ObjectId(),
    //   name: "Test User"
    // };
    
    // Get post data from request body
    const { title, description, imageUrl } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    
    // Create new post
    const newPost = new Post({
      username: user.fullName, // Using name field instead of username
      userId: user._id,
      title,
      description,
      imageUrl, // Make sure this matches your Post model field (imageUrl vs imageurl)
      comments: [],
      date: new Date()
    });
    
    // Save post to database
    const savedPost = await newPost.save();
    
    res.status(201).json(savedPost);
  } 
  catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all posts (for feed)
const getAllPosts = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get posts sorted by date (newest first)
    const posts = await Post.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);
    
    // Count total posts for pagination info
    const total = await Post.countDocuments();
    
    res.status(200).json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalPosts: total
    });
  } 
  catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get posts by user
const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;
    
    const posts = await Post.find({ username }) // This will match posts with username field
      .sort({ date: -1 });
    
    res.status(200).json(posts);
  } 
  catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    res.status(200).json(post);
  } 
  catch (error) {
    console.error("Get post by ID error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    // const token = req.headers.authorization?.split(" ")[1];
    
    // if (!token) {
    //   return res.status(401).json({ message: "No token provided, authorization denied" });
    // }
    
    // // Verify token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = "67c635f027066576e3fe9fdf";
    
    // Find post
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user owns the post (using userId from token)
    // if (post.userId.toString() !== (decoded.userId || decoded.id)) {
    //   return res.status(403).json({ message: "Not authorized to update this post" });
    // }

    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }
    
    const { title, description, imageUrl } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { 
        title: title || post.title,
        description: description || post.description,
        imageUrl: imageUrl || post.imageUrl 
      },
      { new: true }
    );
    
    res.status(200).json(updatedPost);
  } 
  catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find post
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user owns the post
    if (post.userId.toString() !== (decoded.userId || decoded.id)) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }
    
    // Delete post
    await Post.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: "Post deleted successfully" });
  } 
  catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add comment to post
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Find post
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Create comment - match field names with your schema
    const newComment = {
      userId: user._id,
      username: user.fullName, // Using name instead of username
      content: text, // Using content instead of text to match your schema
      createdAt: new Date() // Using createdAt instead of date to match your schema
    };
    
    // Add comment to post
    post.comments.unshift(newComment);
    
    // Save post with new comment
    await post.save();
    
    res.status(201).json(post.comments);
  } 
  catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find post
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Find comment
    const comment = post.comments.find(
      comment => comment._id.toString() === commentId
    );
    
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check if user owns the comment or the post
    if (comment.userId.toString() !== (decoded.userId || decoded.id) && 
        post.userId.toString() !== (decoded.userId || decoded.id)) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }
    
    // Get comment index
    const commentIndex = post.comments.findIndex(
      comment => comment._id.toString() === commentId
    );
    
    // Remove comment
    post.comments.splice(commentIndex, 1);
    
    // Save post
    await post.save();
    
    res.status(200).json(post.comments);
  } 
  catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Delete comment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  deleteComment
};