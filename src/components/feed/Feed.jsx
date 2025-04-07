import React from 'react';
import './Feed.css'; 

const Feed = ({ posts }) => {
    // If posts are passed as props, use them
    // If not, use the posts from state (for backward compatibility)
    const displayPosts = posts || [];

    return (
        <div className="feed">
            <h2>User Feed</h2>
            <div className="feed-posts">
                {displayPosts.length === 0 ? (
                    <p>No posts available</p>
                ) : (
                    displayPosts.map((post) => (
                        <div key={post._id || post.id || Math.random()} className="post">
                            <h3>{post.title}</h3>
                            <p>{post.description}</p>
                            {post.username && <p><strong>Username:</strong> {post.username}</p>}
                            {post.imageUrl && (
                                <img src={`http://localhost:5001${post.imageUrl}`} alt={post.title} />
                            )}
                            {post.comments && post.comments.length > 0 && (
                                <p><strong>Comments:</strong> {post.comments.length}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Feed;