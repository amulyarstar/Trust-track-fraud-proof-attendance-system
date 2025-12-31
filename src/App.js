import React, { useState } from 'react';
import WebcamCapture from './components/WebcamCapture';
import Dashboard from './components/Dashboard';
import { initGemini } from './utils/gemini';
import './App.css';

function App() {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('camera');

  // Initialize Gemini on app start
  React.useEffect(() => {
    const geminiInitialized = initGemini();
    if (geminiInitialized) {
      console.log('Gemini AI initialized successfully');
    }
  }, []);

  const handleNewAttendance = (log) => {
    setAttendanceLogs(prev => [log, ...prev].slice(0, 50));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="app-title">
          <span className="app-icon">🔒</span>
          TrustTrack - Fraud-Proof Attendance System
        </h1>
        <p className="app-subtitle">
          AI-powered attendance with privacy protection and explainable decisions
        </p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'camera' ? 'active' : ''}`}
          onClick={() => setActiveTab('camera')}
        >
          📷 Live Camera
        </button>
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
       
      </nav>

      <main className="app-main">
        {activeTab === 'camera' ? (
          <div className="camera-section">
            <div className="section-header">
              <h2>Live Attendance Capture</h2>
              <p className="section-description">
                AI detects faces, blurs background for privacy, and checks for fraud attempts.
                Automatically logs attendance every 5 seconds.
              </p>
            </div>
            <WebcamCapture onAttendanceLog={handleNewAttendance} />
          </div>
        ) : (
          <Dashboard />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="tech-stack">
            <h4>Powered by Google Technologies</h4>
            <div className="tech-icons">
              <span className="tech-icon"> Gemini AI</span>
              <span className="tech-icon"> Firebase</span>
              <span className="tech-icon"> React</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
