import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './SkinImageUpload.css';

const SkinImageUpload = ({ onImageSelect, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, or WebP)');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        handleFile(file);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setError(null);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        handleFile(file);
      }
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleAnalyze = () => {
    if (selectedFile && onImageSelect) {
      onImageSelect(selectedFile);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="skin-image-upload">
      <div className="upload-header">
        <h3>Upload Skin Image</h3>
        <p>Take or upload a clear photo of your skin condition</p>
      </div>

      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        {!preview ? (
          <motion.div
            className="upload-placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="upload-icon">
              <span>📷</span>
            </div>
            <h4>Drag & drop your image here</h4>
            <p>or click to browse</p>
            <div className="supported-formats">
              <span>Supported: JPEG, PNG, WebP</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="preview-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img src={preview} alt="Preview" className="image-preview" />
            <button
              type="button"
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </div>

      {error && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>⚠️</span> {error}
        </motion.div>
      )}

      <div className="upload-tips">
        <h5>📸 Photo Tips</h5>
        <ul>
          <li>Use good lighting - natural daylight works best</li>
          <li>Take a close-up photo of the affected area</li>
          <li>Make sure the image is in focus</li>
          <li>Include the surrounding healthy skin for context</li>
          <li>Avoid using flash as it can cause glare</li>
        </ul>
      </div>

      {preview && (
        <motion.button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={isLoading}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <span className="loading-text">Analyzing...</span>
          ) : (
            <>
              <span className="btn-icon">🔍</span>
              Analyze Image
            </>
          )}
        </motion.button>
      )}
    </div>
  );
};

export default SkinImageUpload;