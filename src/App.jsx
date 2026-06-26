import { useEffect } from 'react';
import useStore from './engine/gameState';
import { startSimulation, stopSimulation } from './engine/timeEngine';
import './App.css';

function App() {
  // Pull data from the Zustand store
  const { 
    time, batteryLevel, isBlackout, activeEvent, 
    settings, togglePause, upgradeInfrastructure, loadGame 
  } = useStore();

  useEffect(() => {
    // 1. Load saved state from localStorage on startup
    loadGame();
    
    // 2. Start the animation loop
    startSimulation();
    
    // 3. Cleanup on shutdown
    return () => stopSimulation();
  }, [loadGame]);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>Energy Grid Simulation</h1>
      
      {/* Status Panel */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: isBlackout ? '#ffcccc' : '#f0f9ff',
        borderRadius: '12px',
        border: '1px solid #ddd'
      }}>
        <h2 style={{ color: isBlackout ? 'red' : 'green' }}>
          {isBlackout ? '⚠️ BLACKOUT' : '✅ Power Stable'}
        </h2>
        <p>Simulation Time: {time.toFixed(2)}:00</p>
        <p>Battery Level: <strong>{batteryLevel.toFixed(1)}%</strong></p>
      </div>

      {/* Events */}
      {activeEvent && (
        <div style={{ color: 'red', fontWeight: 'bold', margin: '15px 0' }}>
          🚨 EMERGENCY: {activeEvent.name} active!
        </div>
      )}

      {/* Control Panel */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
        <button onClick={togglePause}>
          {settings.isPaused ? 'Resume' : 'Pause'}
        </button>
        <button onClick={() => upgradeInfrastructure('solarCapacity')}>
          Upgrade Solar (+20%)
        </button>
        <button onClick={() => useStore.getState().saveGame()}>
          Save Progress
        </button>
      </div>
    </div>
  );
}

export default App;