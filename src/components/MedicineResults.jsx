import React from 'react';
import { motion } from 'framer-motion';
import './MedicineResults.css';

const MedicineCard = ({ medicine, index }) => {
  const confidence = Math.round((medicine.confidence || 0) * 100);

  return (
    <motion.div
      className="medicine-card"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <div className="medicine-header">
        <h3>{medicine.name}</h3>
        <div className="confidence-badge" title="Match confidence">
          {confidence}%
        </div>
      </div>

      <div className="medicine-category">
        <span className="category-tag">{medicine.category.replace('_', ' ')}</span>
      </div>

      <div className="medicine-details">
        <div className="detail-row">
          <strong>Dosage:</strong>
          <span>{medicine.dosage}</span>
        </div>

        <div className="detail-row">
          <strong>Max Daily:</strong>
          <span>{medicine.maxDaily}</span>
        </div>
      </div>

      {medicine.sideEffects && medicine.sideEffects.length > 0 && (
        <div className="side-effects">
          <strong>Side Effects:</strong>
          <ul>
            {medicine.sideEffects.slice(0, 3).map((effect, i) => (
              <li key={i}>{effect}</li>
            ))}
          </ul>
        </div>
      )}

      {medicine.warnings && medicine.warnings.length > 0 && (
        <div className="warnings">
          <strong>Warnings:</strong>
          <ul>
            {medicine.warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="matched-symptoms">
        <span className="symptom-label">Matched for:</span>
        {medicine.matchedSymptoms?.map((symptom, i) => (
          <span key={i} className="symptom-tag">
            {symptom.replace('_', ' ')}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

const MedicineResults = ({ medicines, detectedSymptoms }) => {
  if (!medicines || medicines.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="medicine-results-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="results-header">
        <h2>Medicine Recommendations</h2>
        <p className="disclaimer">
          ⚠️ This is NOT medical advice. Consult a healthcare professional before
          taking any medication.
        </p>
      </div>

      {detectedSymptoms && detectedSymptoms.length > 0 && (
        <div className="detected-symptoms">
          <h4>Detected Symptoms:</h4>
          <div className="symptoms-list">
            {detectedSymptoms.map((symptom, index) => (
              <span key={index} className="symptom-badge">
                {symptom.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="medicines-grid">
        {medicines.map((medicine, index) => (
          <MedicineCard key={medicine.id} medicine={medicine} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

export default MedicineResults;