import React, { useState } from 'react';
import './Feed.css';

// Comment Form Component
const CommentForm = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    try {
      const token = localStorage.getItem('token'); // Get auth token
      const response = await fetch(`http://localhost:5001/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      
      if (response.ok) {
        const comments = await response.json();
        setText(''); // Clear input
        onCommentAdded(postId, comments);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="comment-input"
        required
      />
      <button type="submit" className="comment-submit-btn">Submit</button>
    </form>
  );
};

// Comments Component
const Comments = ({ comments }) => {
  return (
    <div className="comments-container">
      {comments.map(comment => (
        <div key={comment._id} className="comment">
          <div className="comment-header">
            <span className="comment-username">{comment.username}</span>
            <span className="comment-date">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="comment-content">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

const Feed = ({ posts }) => {
  // State to manage updated comments
  const [updatedPosts, setUpdatedPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  
  // Handler for when a comment is added
  const handleCommentAdded = (postId, newComments) => {
    setUpdatedPosts(prev => ({
      ...prev,
      [postId]: {...(posts.find(p => p._id === postId) || {}), comments: newComments}
    }));
  };
  
  // Toggle comments visibility
  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Function to get current post with updated comments if available
  const getPost = (post) => {
    return updatedPosts[post._id] || post;
  };

  // Display posts from props or state
  const displayPosts = posts || [];

  return (
    <div className="feed">
      <h2 className="feed-title">User Feed</h2>
      <div className="feed-posts">
        {displayPosts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          displayPosts.map((post) => {
            const currentPost = getPost(post);
            const commentsCount = currentPost.comments?.length || 0;
            const postId = currentPost._id || currentPost.id;
            
            return (
              <div key={postId || Math.random()} className="post">
                <h3>{currentPost.title}</h3>
                <p>{currentPost.description}</p>
                {currentPost.username && <p><strong>Posted by:</strong> {currentPost.username}</p>}
                {currentPost.imageUrl && (
                  <img 
                    src={`http://localhost:5001${currentPost.imageUrl}`} 
                    alt={currentPost.title} 
                    className="post-image"
                  />
                )}
                
                {/* Comments section */}
                <div className="post-comments">
                  <button 
                    className="comments-toggle" 
                    onClick={() => toggleComments(postId)}
                  >
                    {commentsCount > 0 ? 
                      `Comments (${commentsCount})` : 
                      "Add a comment"}
                  </button>
                  
                  {expandedComments[postId] && (
                    <>
                      {commentsCount > 0 && (
                        <Comments comments={currentPost.comments} />
                      )}
                      <CommentForm 
                        postId={postId} 
                        onCommentAdded={handleCommentAdded} 
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Feed;