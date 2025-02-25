const mongoose = require('mongoose');

const PostsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    comments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: String,
        content: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    date: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model('posts', PostsSchema, 'posts');
Posts.createIndexes();

module.exports = Post;