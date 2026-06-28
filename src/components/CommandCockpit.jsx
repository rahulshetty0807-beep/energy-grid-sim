import React from 'react';
import useStore from '../engine/gameState'; // Adjust path if needed
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function CommandCockpit() {
  const { 
    weather, 
    batteryLevel, 
    gridEfficiency, 
    settings,
    history,
    startSimulation, 
    stopSimulation, 
    rebootGrid, 
    triggerWeatherEvent,
    togglePause,
    repairGrid
  } = useStore();

  return (
    <div className="command-cockpit cyberpunk-panel">
      
      {/* 1. MASTER CONTROLS */}
      <div className="control-section">
        <h3 className="neon-title">SIMULATION UPLINK</h3>
        <div className="button-grid">
          <button className="btn-primary start" onClick={startSimulation}>INITIATE ENGINE</button>
          <button className="btn-primary stop" onClick={stopSimulation}>HALT ENGINE</button>
          <button className="btn-primary toggle" onClick={togglePause}>
            {settings.isPaused ? '▶ RESUME' : '⏸ PAUSE'}
          </button>
          <button className="btn-danger reset" onClick={rebootGrid}>REBOOT SYSTEM</button>
          <button className="btn-warning repair" onClick={repairGrid}>DISPATCH REPAIR CREWS</button>
        </div>
      </div>

      {/* 2. ENVIRONMENTAL OVERRIDES */}
      <div className="control-section">
        <h3 className="neon-title">ENVIRONMENTAL HAZARDS</h3>
        <div className="button-grid">
          <button 
            className={`btn-env ${weather === 'CLEAR' ? 'active' : ''}`} 
            onClick={() => triggerWeatherEvent('CLEAR')}
          >
            CLEAR SKIES
          </button>
          <button 
            className={`btn-env storm ${weather === 'STORM' ? 'active' : ''}`} 
            onClick={() => triggerWeatherEvent('STORM')}
          >
            SIMULATE STORM
          </button>
          <button 
            className={`btn-env heatwave ${weather === 'HEATWAVE' ? 'active' : ''}`} 
            onClick={() => triggerWeatherEvent('HEATWAVE')}
          >
            SIMULATE HEATWAVE
          </button>
        </div>
      </div>

      {/* 3. REAL-TIME TELEMETRY CHART */}
      <div className="control-section chart-container">
        <h3 className="neon-title">BATTERY DEGRADATION HISTORY</h3>
        <div style={{ width: '100%', height: '200px', marginTop: '20px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <XAxis dataKey="time" hide />
              <YAxis domain={[0, 100]} stroke="#00f3ff" tick={{ fill: '#00f3ff', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #00f3ff', color: '#fff' }} 
              />
              <Line 
                type="monotone" 
                dataKey="battery" 
                stroke="#00f3ff" 
                strokeWidth={3} 
                dot={false}
                isAnimationActive={false} // Prevents chart glitching on fast ticks
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CSS STYLING */}
      <style>{`
        .command-cockpit {
          background: #050508;
          border: 1px solid #00f3ff;
          border-radius: 8px;
          padding: 25px;
          color: #fff;
          font-family: 'Courier New', Courier, monospace;
          box-shadow: inset 0 0 40px rgba(0, 243, 255, 0.05);
          width: 100%;
          max-width: 500px;
        }

        .neon-title {
          color: #00f3ff;
          font-size: 14px;
          letter-spacing: 4px;
          margin-bottom: 15px;
          border-bottom: 1px solid rgba(0, 243, 255, 0.3);
          padding-bottom: 8px;
          text-shadow: 0 0 8px #00f3ff;
        }

        .control-section { margin-bottom: 30px; }
        
        .button-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        button {
          background: rgba(0, 243, 255, 0.05);
          border: 1px solid #00f3ff;
          color: #00f3ff;
          padding: 12px;
          font-family: 'Courier New', Courier, monospace;
          font-weight: bold;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 4px;
        }

        button:hover { background: rgba(0, 243, 255, 0.2); box-shadow: 0 0 15px rgba(0, 243, 255, 0.4); }
        button:active { transform: scale(0.98); }

        .btn-danger { border-color: #ff1a1a; color: #ff1a1a; text-shadow: 0 0 5px #ff1a1a; }
        .btn-danger:hover { background: rgba(255, 26, 26, 0.2); box-shadow: 0 0 15px rgba(255, 26, 26, 0.4); }

        .btn-warning { border-color: #ffb700; color: #ffb700; text-shadow: 0 0 5px #ffb700; }
        .btn-warning:hover { background: rgba(255, 183, 0, 0.2); box-shadow: 0 0 15px rgba(255, 183, 0, 0.4); }

        .btn-env.storm.active { background: rgba(0, 243, 255, 0.4); box-shadow: 0 0 15px rgba(0, 243, 255, 0.8); }
        .btn-env.heatwave.active { border-color: #ffb700; color: #ffb700; background: rgba(255, 183, 0, 0.3); }

      `}</style>
    </div>
  );
}