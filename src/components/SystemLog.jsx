import React from 'react';
import useStore from '../engine/gameState';

export default function SystemLog() {
  const logs = useStore((state) => state.logs);
  
  return (
    <div style={{ 
      height: '250px', 
      background: '#0a0a0f', 
      color: '#00f3ff', // Matches your neon blue theme
      padding: '15px', 
      fontFamily: '"Courier New", Courier, monospace', 
      fontSize: '12px', 
      overflowY: 'auto', 
      border: '1px solid #1a1a2e', 
      borderRadius: '8px',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
    }}>
      <div style={{ 
        borderBottom: '1px solid #1a1a2e', 
        paddingBottom: '8px', 
        marginBottom: '10px', 
        color: '#666',
        letterSpacing: '2px',
        textTransform: 'uppercase'
      }}>
        SYSTEM_LOG_OUTPUT
      </div>
      
      {logs.map((log, i) => (
        <div key={i} style={{ 
          marginBottom: '6px', 
          opacity: i === 0 ? 1 : 0.7, // Highlight the newest log
          textShadow: i === 0 ? '0 0 5px #00f3ff' : 'none'
        }}>
          {`> ${log}`}
        </div>
      ))}
    </div>
  );
}