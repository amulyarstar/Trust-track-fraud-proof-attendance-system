import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';
import { generateExplanation, initGemini, mockGeminiResponse } from '../utils/gemini';
import './Dashboard.css';

const Dashboard = () => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    fraudAlerts: 0,
    privacyProtected: 0
  });

  // Initialize Gemini
  useEffect(() => {
    initGemini();
  }, []);

  // Listen to Firestore changes
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'attendance'),
      (snapshot) => {
        const logs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setAttendanceLogs(logs);
        
        const total = logs.length;
        const present = logs.filter(log => !log.isFraud).length;
        const fraudAlerts = logs.filter(log => log.isFraud).length;
        const privacyProtected = logs.filter(log => log.image && log.image.includes('data:image')).length;
        
        setStats({
          total,
          present,
          fraudAlerts,
          privacyProtected: total > 0 ? Math.round((privacyProtected / total) * 100) : 0
        });
      }
    );

    return () => unsubscribe();
  }, []);

  // --- FIXED: Logic is now correctly placed outside the return block ---
  const handleExplain = async (log) => {
    console.log("AI Analysis requested for:", log); 
    setSelectedLog(log);
    setIsGenerating(true);
    
    try {
      const explanationText = await generateExplanation(log);
      setExplanation(explanationText);
    } catch (error) {
      console.error('Error generating explanation:', error);
      setExplanation(mockGeminiResponse());
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">📊 Attendance Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card green">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Attendance</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </div>
        
        <div className="stat-card blue">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Present Today</h3>
            <p className="stat-number">{stats.present}</p>
          </div>
        </div>
        
        <div className="stat-card red">
          <div className="stat-icon">🚨</div> {/* Changed emoji */}
          <div className="stat-content">
            <h3>Fraud Alerts</h3>
            <p className="stat-number">{stats.fraudAlerts}</p>
          </div>
        </div>
        
        <div className="stat-card purple">
          <div className="stat-icon">🛡️</div> {/* Changed emoji */}
          <div className="stat-content">
            <h3>Privacy Protected</h3>
            <p className="stat-number">{stats.privacyProtected}%</p>
          </div>
        </div>
      </div>
      
      {/* AI Explanation Panel */}
      {selectedLog && (
        <div className="explanation-panel">
          <h3>AI Security Analysis</h3>
          <div className="explanation-content">
            {isGenerating ? (
              <div className="loading">Analyzing facial markers...</div>
            ) : (
              <p>{explanation}</p>
            )}
          </div>
          <button 
            className="close-btn"
            onClick={() => {
              setSelectedLog(null);
              setExplanation('');
            }}
          >
            Close Report
          </button>
        </div>
      )}
      
      {/* Attendance Logs */}
      <div className="logs-section">
        <h2>Recent Attendance</h2>
        <div className="logs-table">
          <div className="table-header">
            <div>Time</div>
            <div>Confidence</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          
          <div className="table-body">
            {attendanceLogs.slice(0, 10).map((log) => (
              <div 
                key={log.id} 
                className={`table-row ${log.isFraud ? 'fraud-row' : ''}`}
              >
                <div>{formatTime(log.timestamp)}</div>
                <div>
                  <span className={`confidence-badge ${log.confidence > 0.8 ? 'high' : 'medium'}`}>
                    {/* Confidence is now multiplied by 100 to avoid 1% vs 100% confusion */}
                    {(Number(log.confidence || 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <div>
                  {log.isFraud ? (
                    <span className="status-badge fraud"> Flagged</span>
                  ) : (
                    <span className="status-badge present">Verified</span>
                  )}
                </div>

                <div>
                  {/* FIXED: Button correctly calls the function without crashing */}
                  <button 
                    className="explain-btn"
                    onClick={() => handleExplain(log)}
                  >
                     Analyze
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;