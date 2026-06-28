import React from 'react';
import useStore from '../engine/gameState';

const formatTime = (t) => {
  const h = Math.floor(t).toString().padStart(2, '0');
  const m = Math.floor((t % 1) * 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

export default function Dashboard() {
  const time = useStore((state) => state.time);
  const batteryLevel = useStore((state) => state.batteryLevel);
  const demand = useStore((state) => state.demand);
  const gridEfficiency = useStore((state) => state.gridEfficiency);
  const gridScore = useStore((state) => state.gridScore); // Correct variable
  const settings = useStore((state) => state.settings);

  // Conditional color for grid health
  const healthColor = (gridEfficiency ?? 1) < 0.5 ? '#ff1a1a' : '#00f3ff';

  return (
    <div className="dashboard-container">
      
      {/* Box 1: SYS TIME */}
      <div className="stat-item">
        <div className="neon-white-label">Sys Time</div>
        <h2 className="stat-value text-white">{formatTime(time ?? 0)}</h2>
      </div>

      {/* Box 2: GRID SCORE */}
      <div className="stat-item">
        <div className="neon-white-label">Grid Score</div>
        {/* FIXED: Now using gridScore instead of score */}
        <h2 className="stat-value text-cyan glow-cyan">{Math.floor(gridScore ?? 0)}</h2>
      </div>

      {/* Box 3: BATTERY / LOAD */}
      <div className="stat-item">
        <div className="neon-white-label">Battery / Load</div>
        <div className="stat-value-sm text-white">
          {(batteryLevel ?? 0).toFixed(1)}% <span className="separator">/</span> {(demand ?? 0).toFixed(0)} <span className="unit">MW</span>
        </div>
      </div>

      {/* Box 4: GRID HEALTH */}
      <div className="stat-item">
        <div className="neon-white-label">Grid Health</div>
        <div 
          className="stat-value-sm" 
          style={{ color: healthColor, textShadow: `0 0 10px ${healthColor}` }}
        >
          {((gridEfficiency ?? 1) * 100).toFixed(0)}%
        </div>
      </div>

      {/* Box 5: CAPACITIES FOOTER */}
      <div className="capacity-footer">
        <strong className="cap-highlight">CAPACITIES:</strong> 
        SOLAR ({settings?.solarCapacity?.toFixed(0) ?? 0}) <span className="separator">|</span> 
        WIND ({settings?.windCapacity?.toFixed(0) ?? 0})
      </div>

      {/* --- FORCED NEON CSS STYLING --- */}
      <style>{`
        .dashboard-container {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 15px !important;
          background: #0a0a0f !important;
          padding: 20px !important;
          border-radius: 8px !important;
          border: 1px solid #1a1a2e !important;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5) !important;
          border: 1px solid #00f3ff !important;
          box-shadow: 0 0 15px rgba(0, 243, 255, 0.2), inset 0 0 15px rgba(0, 243, 255, 0.1) !important;
        }

        .stat-item {
          padding: 15px !important;
          background: rgba(0, 0, 0, 0.4) !important;
          border: 1px solid #1a1a2e !important;
          border-radius: 6px !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }

        .stat-item:hover {
          border-color: rgba(0, 243, 255, 0.3) !important;
          box-shadow: inset 0 0 15px rgba(0, 243, 255, 0.05) !important;
        }

        .neon-white-label {
          color: #ffffff !important;
          font-size: 11px !important;
          letter-spacing: 2px !important;
          text-transform: uppercase !important;
          text-shadow: 0 0 6px #ffffff, 0 0 12px rgba(255, 255, 255, 0.8) !important;
          font-weight: 900 !important;
          margin-bottom: 5px !important;
          font-family: 'Courier New', Courier, monospace !important;
        }

        .stat-value {
          margin: 5px 0 0 0 !important;
          font-size: 24px !important;
          font-family: 'Courier New', Courier, monospace !important;
        }

        .stat-value-sm {
          margin-top: 5px !important;
          font-size: 16px !important;
          font-weight: 900 !important;
          font-family: 'Courier New', Courier, monospace !important;
        }

        .text-white { color: #ffffff !important; }
        .text-cyan { color: #00f3ff !important; }
        .glow-cyan { text-shadow: 0 0 10px #00f3ff !important; }

        .separator {
          color: #444 !important;
          margin: 0 4px !important;
          text-shadow: none !important;
        }

        .unit {
          font-size: 12px !important;
          color: #00f3ff !important;
          text-shadow: 0 0 5px #00f3ff !important;
        }

        .capacity-footer {
          grid-column: span 2 !important;
          padding: 12px 15px !important;
          background: rgba(0, 243, 255, 0.05) !important;
          border-radius: 4px !important;
          border: 1px solid #1a1a2e !important;
          font-size: 12px !important;
          color: #ffffff !important;
          text-shadow: 0 0 5px #ffffff, 0 0 10px rgba(255, 255, 255, 0.5) !important;
          font-weight: bold !important;
          font-family: 'Courier New', Courier, monospace !important;
          text-align: center !important;
        }

        .cap-highlight {
          color: #00f3ff !important;
          margin-right: 8px !important;
          text-shadow: 0 0 8px #00f3ff !important;
          letter-spacing: 1px !important;
        }
      `}</style>
    </div>
  );
}