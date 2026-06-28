import React from 'react';
import useStore from '../engine/gameState';

export default function SystemLog() {
  const logs = useStore((state) => state.logs || []);
  
  return (
    <div className="system-log-container">
      
      {/* Terminal Header */}
      <div className="log-header">
        <div className="neon-title">SYSTEM_LOG_OUTPUT</div>
        <div className="terminal-status">
          <span className="status-text">REC</span>
          <div className="blinking-indicator"></div>
        </div>
      </div>
      
      {logs.map((log, i) => {
  // Use log.msg to check for keywords
  const message = log.msg || "";
  const type = log.type || "";

  // Update logic to check the object properties
  const isCritical = message.includes('CRITICAL') || message.includes('FAILED') || type === 'ERROR';
  const isWarning = message.includes('WARNING') || message.includes('STORM') || type === 'WARN';
  
  let logClass = "log-normal";
  if (isCritical) logClass = "log-critical";
  else if (isWarning) logClass = "log-warning";

  return (
    <div key={i} className={`log-entry ${i === 0 ? 'latest-log' : 'dimmed-log'}`}>
      <span className="log-prefix">{'>'}</span>
      {/* Display log.msg instead of just log */}
      <span className={`log-message ${logClass}`}>{log.msg}</span>
    </div>
  );
})}
        
        {/* Fallback if no logs exist yet */}
        {logs.length === 0 && (
          <div className="log-entry latest-log">
            <span className="log-prefix">{'>'}</span>
            <span className="log-normal">AWAITING TELEMETRY DATA...</span>
          </div>
        )}
      
      <style>{`
        .system-log-container {
          background: #0a0a0f !important;
          border: 1px solid #1a1a2e !important;
          border-radius: 8px !important;
          padding: 15px !important;
          display: flex !important;
          flex-direction: column !important;
          height: 250px !important;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.8) !important;
          box-sizing: border-box !important;
          font-family: 'Courier New', Courier, monospace !important;
        }

        .log-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          border-bottom: 1px solid #1a1a2e !important;
          padding-bottom: 10px !important;
          margin-bottom: 12px !important;
        }

        .neon-title {
          color: #666666 !important;
          font-size: 12px !important;
          letter-spacing: 2px !important;
          margin: 0 !important;
          text-transform: uppercase !important;
          font-weight: bold !important;
        }

        .terminal-status {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
        }

        .status-text {
          color: #ff1a1a !important;
          font-size: 10px !important;
          letter-spacing: 2px !important;
          font-weight: bold !important;
        }

        .blinking-indicator {
          width: 8px !important;
          height: 8px !important;
          background-color: #ff1a1a !important;
          border-radius: 50% !important;
          box-shadow: 0 0 8px #ff1a1a !important;
          animation: blink-anim 1s step-end infinite !important;
        }

        @keyframes blink-anim {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .log-window {
          flex-grow: 1 !important;
          overflow-y: auto !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
          padding-right: 5px !important;
        }

        /* Custom Scrollbar for Terminal */
        .log-window::-webkit-scrollbar {
          width: 4px !important;
        }
        .log-window::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3) !important;
        }
        .log-window::-webkit-scrollbar-thumb {
          background: #1a1a2e !important;
          border-radius: 2px !important;
        }
        .log-window::-webkit-scrollbar-thumb:hover {
          background: #00f3ff !important;
        }

        .log-entry {
          font-size: 12px !important;
          display: flex !important;
          align-items: flex-start !important;
          gap: 10px !important;
          line-height: 1.4 !important;
          transition: all 0.3s ease !important;
        }

        .log-prefix {
          color: #00f3ff !important;
          font-weight: bold !important;
          opacity: 0.8 !important;
        }

        .latest-log {
          opacity: 1.0 !important;
          animation: fade-in-left 0.3s ease-out forwards !important;
        }

        .dimmed-log {
          opacity: 0.6 !important;
        }

        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-5px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Color-Coded Log Messages */
        .log-normal {
          color: #00f3ff !important;
        }
        .latest-log .log-normal {
          text-shadow: 0 0 5px #00f3ff !important;
        }

        .log-warning {
          color: #ffb700 !important;
          font-weight: bold !important;
        }
        .latest-log .log-warning {
          text-shadow: 0 0 8px rgba(255, 183, 0, 0.8) !important;
        }

        .log-critical {
          color: #ff1a1a !important;
          font-weight: bold !important;
          background: rgba(255, 26, 26, 0.05) !important;
          padding: 0 4px !important;
          border-left: 2px solid #ff1a1a !important;
        }
        .latest-log .log-critical {
          text-shadow: 0 0 8px rgba(255, 26, 26, 0.8) !important;
          background: rgba(255, 26, 26, 0.15) !important;
        }
      `}</style>
    </div>
  );
}