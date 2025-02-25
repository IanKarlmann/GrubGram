const mongoose = require('mongoose');

const PostsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imageurl: {
        type: String,
    },
    comments: [{
        userId: String,
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

const Posts = mongoose.model('posts', PostsSchema);
Posts.createIndexes();

module.exports = Posts;