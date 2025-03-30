import React, { useState } from 'react';
import './CreatePostForm.css';

function CreatePostForm({ onCreatePost, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null); // Store the uploaded file

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Save the file to state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the file and other data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile); // Attach the file
    }

    // Debugging: Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    } 

    // Call the onCreatePost function with the form data
    onCreatePost(formData);

    // Reset form
    setTitle('');
    setDescription('');
    setImageFile(null);
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
          <label htmlFor="imageFile">Upload Image</label>
          <input
            type="file"
            id="imageFile"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
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