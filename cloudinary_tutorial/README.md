# Cloudinary Tutorial

## What is Cloudinary?
Cloudinary is a cloud-based service that provides solutions for image and video management, including uploads, storage, manipulations, optimizations, and delivery. It supports various file types including images, videos, audio, and documents.

## Key Features
1. File Upload & Storage
2. Media Transformations
3. Video Processing
4. Document Management
5. AI-powered Features
6. CDN Delivery

## Installation

### Backend Setup
```bash
npm init -y
npm install express cloudinary multer cors dotenv
```

### Frontend Setup
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install axios
```

## Basic Configuration

### Backend (.env)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Backend (cloudinary.config.js)
```javascript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;
```

## Examples

### 1. Basic File Upload
```javascript
// Backend
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Frontend
const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post('/api/upload', formData);
  console.log(response.data);
};
```

### 2. Video Upload with Transformation
```javascript
// Backend
app.post('/api/upload-video', upload.single('video'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
      transformation: [
        { width: 640, height: 360, crop: 'scale' },
        { quality: 'auto' }
      ]
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 3. Document Upload with OCR
```javascript
// Backend
app.post('/api/upload-document', upload.single('document'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
      ocr: 'adv_ocr'
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 4. Image Transformation
```javascript
// Backend
app.get('/api/transform/:publicId', async (req, res) => {
  try {
    const result = await cloudinary.image(req.params.publicId, {
      transformation: [
        { width: 300, height: 300, crop: 'fill' },
        { effect: 'grayscale' },
        { quality: 'auto' }
      ]
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 5. Video Processing
```javascript
// Backend
app.post('/api/process-video', upload.single('video'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'video',
      transformation: [
        { width: 1280, height: 720, crop: 'scale' },
        { quality: 'auto' },
        { format: 'mp4' }
      ],
      eager: [
        { format: 'mp4', quality: 'auto' },
        { format: 'webm', quality: 'auto' }
      ]
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Advanced Features

### 1. Automatic Image Tagging
```javascript
const result = await cloudinary.uploader.upload(file, {
  categorization: 'google_tagging'
});
```

### 2. Face Detection
```javascript
const result = await cloudinary.uploader.upload(file, {
  detection: 'face'
});
```

### 3. Video Thumbnail Generation
```javascript
const result = await cloudinary.uploader.upload(video, {
  resource_type: 'video',
  eager: [
    { format: 'jpg', width: 300, height: 300, crop: 'pad' }
  ]
});
```

## Exercises

### Exercise 1: Media Gallery
Create a media gallery application that:
1. Allows users to upload images and videos
2. Displays uploaded media in a grid layout
3. Implements basic transformations (resize, crop, filters)
4. Allows users to delete their uploads
5. Shows upload progress and status

### Exercise 2: Document Management System
Build a document management system that:
1. Supports PDF, DOC, and image uploads
2. Implements OCR for text extraction
3. Generates thumbnails for documents
4. Allows document categorization
5. Implements search functionality

### Exercise 3: Video Processing Platform
Create a video processing platform that:
1. Accepts video uploads
2. Generates multiple quality versions
3. Creates video thumbnails
4. Implements basic video editing (trim, crop)
5. Provides video playback with quality selection

## Best Practices

1. **Error Handling**
   - Implement proper error handling for uploads
   - Validate file types and sizes
   - Handle network issues gracefully

2. **Security**
   - Use signed uploads for sensitive content
   - Implement upload restrictions
   - Use secure URLs for delivery

3. **Performance**
   - Use eager transformations for frequently accessed media
   - Implement caching strategies
   - Optimize delivery with CDN

4. **User Experience**
   - Show upload progress
   - Provide preview capabilities
   - Implement responsive design

## Common Issues and Solutions

1. **Upload Failures**
   - Check file size limits
   - Verify file type support
   - Ensure proper authentication

2. **Transformation Issues**
   - Verify transformation parameters
   - Check resource type compatibility
   - Monitor transformation limits

3. **Delivery Problems**
   - Verify CDN configuration
   - Check URL signing
   - Monitor bandwidth usage 