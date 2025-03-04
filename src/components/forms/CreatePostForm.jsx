import React, { useState } from 'react';
import './CreatePostForm.css';

function CreatePostForm({ onCreatePost, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      title,
      description,
      imageUrl: imageUrl.trim() ? imageUrl: "", // Handle empty image URL
    };
    onCreatePost(newPost);
    
    // Reset form
    setTitle('');
    setDescription('');
    setImageUrl('');
  };

  return (
    <div className="create-post-form">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter the title of your post"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter the description of your post"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter the image URL (optional)"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Create Post
          </button>
          {onCancel && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreatePostForm;