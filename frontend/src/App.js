import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function TimePicker({ value, onChange, name, label }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const parseTime24To12 = (time24) => {
    if (!time24) return { hour: 12, minute: 0, period: 'AM' };
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    let hour12 = hours % 12;
    if (hour12 === 0) hour12 = 12;
    return { hour: hour12, minute: minutes || 0, period };
  };

  const convert12To24 = (hour, minute, period) => {
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) hour24 = hour + 12;
    if (period === 'AM' && hour === 12) hour24 = 0;
    return `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  };

  const { hour, minute, period } = parseTime24To12(value);
  
  const getInitialState = () => {
    if (value) {
      const parsed = parseTime24To12(value);
      return parsed;
    }
    return { hour: 12, minute: 0, period: 'AM' };
  };

  const initialState = getInitialState();
  const [localHour, setLocalHour] = useState(initialState.hour);
  const [localMinute, setLocalMinute] = useState(initialState.minute);
  const [localPeriod, setLocalPeriod] = useState(initialState.period);
  
  useEffect(() => {
    const parsed = parseTime24To12(value);
    setLocalHour(parsed.hour);
    setLocalMinute(parsed.minute);
    setLocalPeriod(parsed.period);
  }, [value]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleTimeChange = (newHour, newMinute, newPeriod) => {
    const time24 = convert12To24(newHour, newMinute, newPeriod);
    onChange({ target: { name, value: time24 } });
    setLocalHour(newHour);
    setLocalMinute(newMinute);
    setLocalPeriod(newPeriod);
  };

  const displayValue = value 
    ? `${hour}:${String(minute).padStart(2, '0')} ${period}`
    : 'Select time';

  return (
    <div className="time-picker-wrapper">
      <div 
        className="time-picker-input"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className={!value ? 'time-picker-placeholder' : ''}>
          {displayValue}
        </span>
        <svg className="time-picker-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      
      {isOpen && (
        <>
          <div className="time-picker-overlay" onClick={() => setIsOpen(false)} />
          <div className="time-picker-dropdown">
            <div className="time-picker-selectors">
              <div className="time-picker-column">
                <div className="time-picker-label">Hour</div>
                <div className="time-picker-scroll">
                  {hours.map(h => (
                    <button
                      key={h}
                      type="button"
                      className={`time-picker-option ${localHour === h ? 'active' : ''}`}
                      onClick={() => handleTimeChange(h, localMinute, localPeriod)}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="time-picker-column">
                <div className="time-picker-label">Minute</div>
                <div className="time-picker-scroll">
                  {minutes.map(m => (
                    <button
                      key={m}
                      type="button"
                      className={`time-picker-option ${localMinute === m ? 'active' : ''}`}
                      onClick={() => handleTimeChange(localHour, m, localPeriod)}
                    >
                      {String(m).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="time-picker-column">
                <div className="time-picker-label">Period</div>
                <div className="time-picker-period">
                  <button
                    type="button"
                    className={`time-picker-option period-option ${localPeriod === 'AM' ? 'active' : ''}`}
                    onClick={() => handleTimeChange(localHour, localMinute, 'AM')}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    className={`time-picker-option period-option ${localPeriod === 'PM' ? 'active' : ''}`}
                    onClick={() => handleTimeChange(localHour, localMinute, 'PM')}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
            
            <div className="time-picker-footer">
              <button
                type="button"
                className="time-picker-done-btn"
                onClick={() => setIsOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  const [formData, setFormData] = useState({
    bedtime: '',
    wake_time: '',
    tst_min: '',
    waso_min: '',
    awakenings: '',
    deep_min: '',
    rem_min: '',
    caffeine_after_14: false
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        bedtime: formData.bedtime,
        wake_time: formData.wake_time,
        tst_min: parseInt(formData.tst_min),
        waso_min: parseInt(formData.waso_min),
        awakenings: parseInt(formData.awakenings),
        deep_min: formData.deep_min ? parseInt(formData.deep_min) : null,
        rem_min: formData.rem_min ? parseInt(formData.rem_min) : null,
        caffeine_after_14: formData.caffeine_after_14
      };

      const response = await fetch(`${API_URL}/check-sleep-quality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to calculate sleep score');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'fair': return '#FF9800';
      case 'poor': return '#F44336';
      default: return '#757575';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#4CAF50';
    if (score >= 70) return '#8BC34A';
    if (score >= 50) return '#FF9800';
    return '#F44336';
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="header-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6"/>
                <path d="M8 8L8 16M16 8L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4"/>
              </svg>
            </div>
            <div>
              <h1>Sleep Helper</h1>
              <p className="subtitle">Analyze your sleep quality and receive personalized recommendations for better rest.</p>
            </div>
          </div>
        </header>

        <div className="content">
          <div className="info-section">
            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                </svg>
              </div>
              <div className="info-content">
                <h3>Track Your Sleep</h3>
                <p>Enter your sleep data from last night to get personalized insights and recommendations.</p>
              </div>
            </div>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Sleep Times</h2>
              
              <div className="form-group">
                <label htmlFor="bedtime">
                  Bedtime
                  <span className="required">*</span>
                </label>
                <TimePicker
                  name="bedtime"
                  value={formData.bedtime}
                  onChange={handleChange}
                  label="Bedtime"
                />
              </div>

              <div className="form-group">
                <label htmlFor="wake_time">
                  Wake Time
                  <span className="required">*</span>
                </label>
                <TimePicker
                  name="wake_time"
                  value={formData.wake_time}
                  onChange={handleChange}
                  label="Wake Time"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Sleep Metrics</h2>
              
              <div className="form-group">
                <label htmlFor="tst_min">
                  Total Sleep Time (minutes)
                  <span className="required">*</span>
                </label>
                <div className="field-hint">
                  The actual time you spent sleeping, excluding time you were awake in bed
                </div>
                <input
                  type="number"
                  id="tst_min"
                  name="tst_min"
                  value={formData.tst_min}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 420"
                />
              </div>

              <div className="form-group">
                <label htmlFor="waso_min">
                  Wake After Sleep Onset (minutes)
                  <span className="required">*</span>
                </label>
                <div className="field-hint">
                  Total minutes you were awake after falling asleep (e.g., if you woke up for 10 minutes, then 5 minutes later, enter 15)
                </div>
                <input
                  type="number"
                  id="waso_min"
                  name="waso_min"
                  value={formData.waso_min}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 15"
                />
              </div>

              <div className="form-group">
                <label htmlFor="awakenings">
                  Number of Awakenings
                  <span className="required">*</span>
                </label>
                <div className="field-hint">
                  How many times you woke up during the night (count each time you became conscious, even briefly)
                </div>
                <input
                  type="number"
                  id="awakenings"
                  name="awakenings"
                  value={formData.awakenings}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 2"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Optional: Sleep Stages</h2>
              
              <div className="form-group">
                <label htmlFor="deep_min">Deep Sleep (minutes)</label>
                <div className="field-hint">
                  Time spent in deep sleep stage (also called slow-wave sleep). This is the most restorative sleep stage. Optional if you don't have sleep tracking data.
                </div>
                <input
                  type="number"
                  id="deep_min"
                  name="deep_min"
                  value={formData.deep_min}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 90"
                />
              </div>

              <div className="form-group">
                <label htmlFor="rem_min">REM Sleep (minutes)</label>
                <div className="field-hint">
                  Time spent in REM (Rapid Eye Movement) sleep stage. This is when most dreaming occurs. Optional if you don't have sleep tracking data.
                </div>
                <input
                  type="number"
                  id="rem_min"
                  name="rem_min"
                  value={formData.rem_min}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 120"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="caffeine_after_14"
                    checked={formData.caffeine_after_14}
                    onChange={handleChange}
                  />
                  <span>Caffeine consumed after 2 PM</span>
                </label>
                <div className="field-hint">
                  Check this if you had coffee, tea, energy drinks, or other caffeinated beverages after 2:00 PM on the day you're tracking
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="loading-content">
                  <span className="loading-spinner"></span>
                  Analyzing...
                </span>
              ) : (
                'Analyze Sleep Quality'
              )}
            </button>
          </form>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {result && (
            <div className="result-card animate-fade-in">
              <div className="result-header">
                <div className="score-circle animate-scale-in" style={{ borderColor: getScoreColor(result.sleep_quality_score) }}>
                  <div className="score-value" style={{ color: getScoreColor(result.sleep_quality_score) }}>
                    {result.sleep_quality_score}
                  </div>
                  <div className="score-label">Score</div>
                </div>
                <div className="quality-badge animate-slide-in" style={{ backgroundColor: getQualityColor(result.sleep_quality) }}>
                  {result.sleep_quality.charAt(0).toUpperCase() + result.sleep_quality.slice(1)}
                </div>
              </div>

              <div className="result-description animate-fade-in-delay">
                <p>{result.sleep_quality_description}</p>
              </div>

              <div className="result-explanation animate-fade-in-delay-2">
                <h3>Details</h3>
                <p>{result.sleep_quality_score_explanation}</p>
              </div>

              <div className="recommendations animate-fade-in-delay-3">
                <h3>Recommendations</h3>
                <div className="recommendations-grid">
                  {result.sleep_quality_recommendations.map((rec, index) => (
                    <div key={index} className="recommendation-card">
                      <div className="recommendation-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
