# Multer Guide for File Uploads in Node.js and React

## What is Multer?
Multer is a Node.js middleware for handling `multipart/form-data`, which is primarily used for file uploads. It's built on top of busboy for efficient handling of file uploads.

## Installation
```bash
npm install multer
```

## Basic Setup in Node.js/Express

### 1. Basic File Upload
```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

// Create multer instance
const upload = multer({ storage: storage });

// Single file upload route
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded successfully', file: req.file });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 2. Multiple File Upload
```javascript
// Multiple files upload route
app.post('/upload-multiple', upload.array('files', 5), (req, res) => {
  res.json({ message: 'Files uploaded successfully', files: req.files });
});
```

### 3. File Filtering
```javascript
const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
});
```

## React Frontend Implementation

### 1. Basic File Upload Component
```jsx
import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('File uploaded successfully!');
    } catch (error) {
      setMessage('Error uploading file');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default FileUpload;
```

### 2. Multiple File Upload Component
```jsx
import React, { useState } from 'react';
import axios from 'axios';

function MultipleFileUpload() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:3000/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Files uploaded successfully!');
    } catch (error) {
      setMessage('Error uploading files');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Upload Files</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default MultipleFileUpload;
```

## Exercises

1. **Basic File Upload with Preview**
   - Create a file upload component that shows a preview of the selected image before uploading
   - Add a progress bar to show upload progress
   - Implement error handling for file size limits

2. **Drag and Drop Upload**
   - Create a drag and drop zone for file uploads
   - Show a preview of dropped files
   - Allow multiple file selection
   - Add file type validation

3. **File Upload with Progress**
   - Implement a file upload system that shows:
     - Upload progress percentage
     - File size
     - Upload speed
     - Estimated time remaining
   - Add the ability to cancel ongoing uploads

4. **Image Upload with Processing**
   - Create an image upload system that:
     - Resizes images before upload
     - Converts images to different formats
     - Adds watermarks
     - Compresses images

5. **Secure File Upload System**
   - Implement a secure file upload system that:
     - Validates file types
     - Scans files for viruses
     - Generates unique filenames
     - Stores files in a secure location
     - Implements rate limiting

## Best Practices

1. Always validate file types and sizes on both client and server side
2. Use secure file naming conventions
3. Implement proper error handling
4. Set appropriate file size limits
5. Use environment variables for configuration
6. Implement proper security measures
7. Handle file cleanup for failed uploads
8. Use proper content-type headers
9. Implement proper error messages
10. Add loading states and progress indicators

## Common Issues and Solutions

1. **CORS Issues**
   - Ensure proper CORS configuration on the server
   - Use appropriate headers in requests

2. **File Size Limits**
   - Configure both client and server-side limits
   - Use proper error handling for oversized files

3. **Memory Issues**
   - Use streaming for large files
   - Implement proper cleanup

4. **Security Concerns**
   - Validate file types
   - Scan for malware
   - Use secure file naming
   - Implement proper access control 