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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`, {
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

const ReportModal = ({ isOpen, onClose, postInfo, onSubmit }) => {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
  
    if (!isOpen) return null;
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('${process.env.REACT_APP_API_URL}/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            postId: postInfo.id,
            postTitle: postInfo.title,
            postUsername: postInfo.username,
            reason: reason
          })
        });
        
        if (response.ok) {
          setSubmitMessage('Report submitted successfully');
          setTimeout(() => {
            setSubmitMessage('');
            onClose();
            setReason('');
          }, 2000);
        } else {
          setSubmitMessage('Failed to submit report');
        }
      } catch (error) {
        console.error('Error submitting report:', error);
        setSubmitMessage('Error submitting report');
      } finally {
        setIsSubmitting(false);
      }
    };
  
    return (
      <div className="modal-overlay">
        <div className="report-modal">
          <h3>Report Post</h3>
          <p>Post: "{postInfo.title}" by {postInfo.username}</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reportReason">Reason for reporting:</label>
              <textarea
                id="reportReason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please explain why this post is inappropriate..."
                required
              />
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
            
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('successfully') ? 'success' : 'error'}`}>
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

const Feed = ({ posts }) => {
  // State to manage updated comments
  const [updatedPosts, setUpdatedPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingPost, setReportingPost] = useState(null);
  
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

  const handleReportClick = (post) => {
    setReportingPost({
      id: post._id || post.id,
      title: post.title,
      username: post.username
    });
    setReportModalOpen(true);
  };
  
  // Handler for closing the report modal
  const handleCloseReportModal = () => {
    setReportModalOpen(false);
    setReportingPost(null);
  };

  // Display posts from props or state
  const displayPosts = posts || [];

  return (
    <div className="feed">
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
                <div className="post-header">
                  <h3>{currentPost.title}</h3>
                  <button 
                    className="report-button"
                    onClick={() => handleReportClick(currentPost)}
                    title="Report this post"
                  >
                    ⚠️
                  </button>
                </div>
                
                <p>{currentPost.description}</p>
                {currentPost.username && <p><strong>Posted by:</strong> {currentPost.username}</p>}
                {currentPost.imageUrl && (
                  <img 
                    src={`${process.env.REACT_APP_API_URL}${currentPost.imageUrl}`} 
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
      
      {/* Report Modal */}
      <ReportModal 
        isOpen={reportModalOpen}
        onClose={handleCloseReportModal}
        postInfo={reportingPost || {}}
        onSubmit={() => {
          // Handle successful submission if needed
          handleCloseReportModal();
        }}
      />
    </div>
  );
};

export default Feed;
