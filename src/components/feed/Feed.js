import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feed = () => {
    const [posts, setPosts] = useState([]);

    // Fetch posts when the component mounts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts');
                setPosts(response.data.posts); // Assuming your API returns posts as 'posts'
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []); // Empty dependency array means this effect will run once when the component mounts

    return (
        <div className="feed">
            <h2>Feed</h2>
            <div className="feed-posts">
                {posts.length === 0 ? (
                    <p>No posts available</p>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className="post">
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            <p><strong>Username:</strong> {post.username}</p>
                            <img src={post.imageUrl} alt={post.title} />
                            <p><strong>Comments:</strong> {post.comments.length}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Feed;
