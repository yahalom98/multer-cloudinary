import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [resources, setResources] = useState([]);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
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
      
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button 
          onClick={handleUpload} 
          disabled={!file || uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {message && <div className="message">{message}</div>}

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
              <p>{resource.public_id}</p>
              <button onClick={() => handleDelete(resource.public_id)}>
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