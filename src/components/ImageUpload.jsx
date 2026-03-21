import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import './ImageUpload.css';

const ImageUpload = ({ onImageSelect, isLoading }) => {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onImageSelect(file);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
    disabled: isLoading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const clearImage = (e) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <motion.div
      className="image-upload-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2>Upload Skin Image</h2>
      <p className="instruction">
        Upload a photo of your skin condition for AI analysis
      </p>

      {!preview ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'drag-active' : ''} ${isLoading ? 'disabled' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="dropzone-content">
            <div className="upload-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <>
                <p>Drag and drop an image here, or click to select</p>
                <p className="sub-text">Supports PNG, JPG, JPEG, WebP</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="image-preview">
          <img src={preview} alt="Preview" />
          <button
            className="clear-button"
            onClick={clearImage}
            disabled={isLoading}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {isLoading && (
            <div className="analyzing-overlay">
              <div className="analyzing-spinner"></div>
              <p>Analyzing image...</p>
            </div>
          )}
        </div>
      )}

      <div className="tips">
        <h4>Tips for best results:</h4>
        <ul>
          <li>Use good lighting</li>
          <li>Ensure the affected area is clearly visible</li>
          <li>Include a reference object for scale if possible</li>
          <li>Avoid blurry images</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ImageUpload;