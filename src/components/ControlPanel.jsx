import React from 'react';
import useStore from '../engine/gameState';

export default function ControlPanel() {
  const { togglePause, upgradeInfrastructure, repairGrid, saveGame, settings, gridEfficiency } = useStore();

  // Cyberpunk-themed button style generator
  const getBtnStyle = (baseColor, isSpan = false) => ({
    padding: '12px 15px',
    background: 'rgba(0, 0, 0, 0.4)',
    color: baseColor,
    border: `1px solid ${baseColor}`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '900',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    transition: 'all 0.2s ease',
    gridColumn: isSpan ? 'span 2' : 'auto',
    textAlign: 'center'
  });

  return (
    <div style={{ 
      background: '#0a0a0f', 
      padding: '20px', 
      borderRadius: '8px', 
      border: '1px solid #1a1a2e',
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '15px' 
    }}>
      
      <button 
        style={getBtnStyle('#00f3ff')} 
        onClick={togglePause}
        onMouseOver={(e) => { e.target.style.background = 'rgba(0, 243, 255, 0.1)'; }}
        onMouseOut={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.4)'; }}
      >
        {settings.isPaused ? '▶ Resume' : '⏸ Pause'}
      </button>

      <button 
        style={getBtnStyle(gridEfficiency < 1 ? '#ffea00' : '#00f3ff')} 
        onClick={repairGrid}
        onMouseOver={(e) => { e.target.style.background = 'rgba(255, 234, 0, 0.1)'; }}
        onMouseOut={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.4)'; }}
      >
        🔧 Repair Grid
      </button>

      <button 
        style={getBtnStyle('#00f3ff')} 
        onClick={() => upgradeInfrastructure('solarCapacity')}
        onMouseOver={(e) => { e.target.style.background = 'rgba(0, 243, 255, 0.1)'; }}
        onMouseOut={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.4)'; }}
      >
        ☀️ Upgrade Solar
      </button>

      <button 
        style={getBtnStyle('#00f3ff')} 
        onClick={() => upgradeInfrastructure('windCapacity')}
        onMouseOver={(e) => { e.target.style.background = 'rgba(0, 243, 255, 0.1)'; }}
        onMouseOut={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.4)'; }}
      >
        💨 Upgrade Wind
      </button>

      <button 
        style={getBtnStyle('#fff', true)} 
        onClick={saveGame}
        onMouseOver={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; }}
        onMouseOut={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.4)'; }}
      >
        💾 Save System State
      </button>

    </div>
  );
}