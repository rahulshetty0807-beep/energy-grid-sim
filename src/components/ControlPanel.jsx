import React from 'react';
import useStore from '../engine/gameState';

export default function ControlPanel() {
  // Added default fallbacks (e.g., settings = {}) to prevent crashes if state is loading
  const { 
    togglePause, 
    upgradeInfrastructure, 
    repairGrid, 
    saveGame, 
    settings = {}, 
    gridEfficiency = 1 
  } = useStore();

  const isDamaged = gridEfficiency < 1.0;

  // Cyberpunk-themed button style generator
  const getBtnStyle = (baseColor, isSpan = false, isDisabled = false) => ({
    padding: '12px 15px',
    background: isDisabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.4)',
    color: isDisabled ? '#555' : baseColor,
    border: `1px solid ${isDisabled ? '#333' : baseColor}`,
    borderRadius: '4px',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    fontWeight: '900',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    transition: 'all 0.2s ease',
    gridColumn: isSpan ? 'span 2' : 'auto',
    textAlign: 'center',
    fontFamily: '"Courier New", monospace'
  });

  return (
    <div style={{ 
      background: 'rgba(0, 0, 0, 0.7)', 
      padding: '20px', 
      borderRadius: '8px', 
      border: '1px solid #333',
      borderTop: '4px solid #00f3ff',
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '15px' 
    }}>
      
      <button 
        style={getBtnStyle(settings.isPaused ? '#ffea00' : '#00f3ff')} 
        onClick={togglePause}
        onMouseOver={(e) => { e.target.style.background = 'rgba(0, 243, 255, 0.1)'; }}
        onMouseOut={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.4)'; }}
      >
        {settings.isPaused ? '▶ RESUME ENGINE' : '⏸ PAUSE ENGINE'}
      </button>

      <button 
        style={getBtnStyle(isDamaged ? '#ff4d4d' : '#00f3ff', false, !isDamaged)} 
        onClick={repairGrid}
        disabled={!isDamaged}
        onMouseOver={(e) => { if (isDamaged) e.target.style.background = 'rgba(255, 77, 77, 0.1)'; }}
        onMouseOut={(e) => { if (isDamaged) e.target.style.background = 'rgba(0, 0, 0, 0.4)'; }}
      >
        🔧 {isDamaged ? 'SYS_REPAIR (REQ)' : 'SYS_NOMINAL'}
      </button>

      <button 
        style={getBtnStyle('#00f3ff')} 
        onClick={() => upgradeInfrastructure && upgradeInfrastructure('solarCapacity')}
        onMouseOver={(e) => { e.target.style.background = 'rgba(0, 243, 255, 0.1)'; }}
        onMouseOut={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.4)'; }}
      >
        ☀️ UPGRADE SOLAR
      </button>

      <button 
        style={getBtnStyle('#00f3ff')} 
        onClick={() => upgradeInfrastructure && upgradeInfrastructure('windCapacity')}
        onMouseOver={(e) => { e.target.style.background = 'rgba(0, 243, 255, 0.1)'; }}
        onMouseOut={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.4)'; }}
      >
        💨 UPGRADE WIND
      </button>

      <button 
        style={getBtnStyle('#00f3ff', true)} 
        onClick={saveGame}
        onMouseOver={(e) => { e.target.style.background = 'rgba(0, 243, 255, 0.2)'; }}
        onMouseOut={(e) => { e.target.style.background = 'rgba(0, 0, 0, 0.4)'; }}
      >
        💾 COMMIT MEMORY TO STORAGE
      </button>

    </div>
  );
}