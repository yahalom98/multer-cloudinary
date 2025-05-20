import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [resources, setResources] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/resources');
      setResources(response.data.resources);
    } catch (error) {
      setMessage('Error fetching resources: ' + error.message);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData);
      setMessage('File uploaded successfully!');
      setFile(null);
      fetchResources();
    } catch (error) {
      setMessage('Error uploading file: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete/${publicId}`);
      setMessage('File deleted successfully!');
      fetchResources();
    } catch (error) {
      setMessage('Error deleting file: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1>Cloudinary File Upload</h1>
      
      <div 
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          onChange={handleFileChange}
          id="file-input"
          className="file-input"
        />
        <label htmlFor="file-input" className="file-label">
          {dragActive ? (
            <span>Drop your file here</span>
          ) : (
            <span>Drag and drop a file here or click to select</span>
          )}
        </label>
      </div>

      {file && (
        <div className="file-info">
          <p>Selected file: {file.name}</p>
          <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <button 
        className="upload-button"
        onClick={handleUpload} 
        disabled={!file || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      <div className="resources-grid">
        {resources.map((resource) => (
          <div key={resource.public_id} className="resource-card">
            {resource.resource_type === 'image' ? (
              <img src={resource.secure_url} alt={resource.public_id} />
            ) : resource.resource_type === 'video' ? (
              <video src={resource.secure_url} controls />
            ) : (
              <div className="file-icon">📄</div>
            )}
            <div className="resource-info">
              <p className="resource-name">{resource.public_id}</p>
              <button 
                className="delete-button"
                onClick={() => handleDelete(resource.public_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 