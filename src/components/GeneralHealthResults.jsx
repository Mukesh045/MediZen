import React from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '../services/generalHealthDiagnosis';
import './GeneralHealthResults.css';

const GeneralHealthResults = ({ diagnosisResult }) => {
  const { primaryCondition, medicines, routine, detectedSymptoms } = diagnosisResult;

  const formatConditionName = (name) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="general-health-results">
      <motion.div
        className="diagnosis-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Health Condition Detected</h2>
        <div className="condition-badge">
          {formatConditionName(primaryCondition)}
        </div>
        <div className="symptoms-info">
          <span>Detected: {detectedSymptoms.map(s => formatConditionName(s)).join(', ')}</span>
        </div>
      </motion.div>

      {medicines.length > 0 && (
        <motion.div
          className="medicines-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Recommended Medicines</h3>
          <p className="section-subtitle">Two options - choose based on your budget (both give same result)</p>

          {medicines.map((medPair, index) => (
            <div key={index} className="medicine-pair">
              <div className="medicine-header">
                <h4>For {formatConditionName(medPair.condition)}</h4>
                <div className="matched-symptoms">
                  {medPair.matchedSymptoms.slice(0, 3).map((sym, i) => (
                    <span key={i} className="symptom-tag">{formatConditionName(sym)}</span>
                  ))}
                </div>
              </div>

              <div className="medicine-options">
                {medPair.primary && (
                  <div className="medicine-card premium">
                    <div className="price-badge recommended">RECOMMENDED</div>
                    <div className="medicine-name">{medPair.primary.name}</div>
                    <div className="medicine-price">
                      <span className="price-value">{formatPrice(medPair.primary.price)}</span>
                      <span className="price-unit">{medPair.primary.priceUnit}</span>
                    </div>
                    <div className="effectiveness">
                      <span className="label">Effectiveness:</span>
                      <span className="value">{medPair.primary.effectiveness}</span>
                    </div>
                    <div className="medicine-details">
                      <div className="detail-section">
                        <h5>Uses:</h5>
                        <p>{medPair.primary.uses.map(u => formatConditionName(u)).join(', ')}</p>
                      </div>
                      <div className="detail-section">
                        <h5>Dosage:</h5>
                        <p>{medPair.primary.dosage}</p>
                      </div>
                      <div className="detail-section">
                        <h5>Side Effects:</h5>
                        <p>{medPair.primary.sideEffects.join(', ')}</p>
                      </div>
                      {medPair.primary.tips && (
                        <div className="detail-section">
                          <h5>Tips:</h5>
                          <ul className="tips-list">
                            {medPair.primary.tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {medPair.alternative && (
                  <div className="medicine-card budget">
                    <div className="price-badge budget-badge">BUDGET OPTION</div>
                    <div className="medicine-name">{medPair.alternative.name}</div>
                    <div className="medicine-price">
                      <span className="price-value">{formatPrice(medPair.alternative.price)}</span>
                      <span className="price-unit">{medPair.alternative.priceUnit}</span>
                    </div>
                    {medPair.primary && (
                      <div className="savings-badge">
                        Save {formatPrice(medPair.primary.price - medPair.alternative.price)}
                      </div>
                    )}
                    <div className="effectiveness">
                      <span className="label">Effectiveness:</span>
                      <span className="value">{medPair.alternative.effectiveness}</span>
                    </div>
                    <div className="medicine-details">
                      <div className="detail-section">
                        <h5>Uses:</h5>
                        <p>{medPair.alternative.uses.map(u => formatConditionName(u)).join(', ')}</p>
                      </div>
                      <div className="detail-section">
                        <h5>Dosage:</h5>
                        <p>{medPair.alternative.dosage}</p>
                      </div>
                      <div className="detail-section">
                        <h5>Side Effects:</h5>
                        <p>{medPair.alternative.sideEffects.join(', ')}</p>
                      </div>
                      {medPair.alternative.tips && (
                        <div className="detail-section">
                          <h5>Tips:</h5>
                          <ul className="tips-list">
                            {medPair.alternative.tips.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {routine && (
        <motion.div
          className="routine-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Care Routine</h3>
          <div className="routine-grid">
            {Object.entries(routine).map(([timeOfDay, activities]) => (
              <div key={timeOfDay} className="routine-card">
                <h4>{timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}</h4>
                <ul>
                  {activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="disclaimer">
        <p>
          ⚠️ <strong>Important:</strong> This is general information only.
          Please consult a doctor for proper diagnosis. Prices are approximate.
        </p>
      </div>
    </div>
  );
};

export default GeneralHealthResults;