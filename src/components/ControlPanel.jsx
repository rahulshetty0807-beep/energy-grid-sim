import React, { useState } from 'react';
import useStore from '../engine/gameState';

export default function ControlPanel({ layout = 'vertical' }) {
  const { startSimulation, stopSimulation, repairGrid, triggerWeatherEvent, interval } = useStore();
  
  // Local state to track active environmental filters (for glowing active states)
  const [activeEnv, setActiveEnv] = useState('CLEAR');

  // Check if the engine is currently running by looking for the interval
  const isRunning = !!interval;

  const handleToggleEngine = () => {
    if (isRunning) {
      stopSimulation();
    } else {
      startSimulation();
    }
  };

  const handleEnvClick = (type) => {
    setActiveEnv(type);
    if (triggerWeatherEvent) triggerWeatherEvent(type);
  };

  return (
    <div className={`control-panel layout-${layout}`}>
      
      {/* --- ENGINE UPLINK (Simplified to 2 Buttons) --- */}
      <div>
        <h3 className="neon-title">ENGINE UPLINK</h3>
        <div className="button-grid">
          {/* Smart Toggle Button */}
          <button 
            onClick={handleToggleEngine}
            className={isRunning ? 'active' : ''}
          >
            {isRunning ? '|| PAUSE' : '▶ INITIATE / RESUME'}
          </button>
          
          {/* Hard Reboot Button */}
          <button onClick={() => window.location.reload()}>
            ↻ REBOOT
          </button>
        </div>
      </div>

      {/* --- INFRASTRUCTURE --- */}
      <div>
        <h3 className="neon-title">INFRASTRUCTURE</h3>
        <div className="button-grid">
          <button onClick={repairGrid}>
            🔧 REPAIR GRID
          </button>
          <button>
            ☀️ UPG SOLAR
          </button>
          <button>
            💨 UPG WIND
          </button>
          <button>
            💾 SAVE SYSTEM STATE
          </button>
        </div>
      </div>

      {/* --- ENVIRONMENTAL --- */}
      <div>
        <h3 className="neon-title">ENVIRONMENTAL</h3>
        <div className="button-grid">
          <button 
            className={`btn-env ${activeEnv === 'CLEAR' ? 'active' : ''}`} 
            onClick={() => handleEnvClick('CLEAR')}
          >
            CLEAR SKIES
          </button>
          <button 
            className={`btn-env storm ${activeEnv === 'STORM' ? 'active' : ''}`} 
            onClick={() => handleEnvClick('STORM')}
          >
            STORM
          </button>
          <button 
            className={`btn-env heatwave span-2 ${activeEnv === 'HEATWAVE' ? 'active' : ''}`} 
            onClick={() => handleEnvClick('HEATWAVE')}
          >
            SIMULATE HEATWAVE
          </button>
        </div>
      </div>

      {/* --- 100% UN-REDUCED UNIFORM NEON BLUE STYLES --- */}
      <style>{`
        .control-panel {
          background: #0a0a0f !important;
          border: 1px solid #1a1a2e !important;
          border-radius: 8px !important;
          padding: 20px !important;
          color: #fff !important;
          font-family: 'Courier New', Courier, monospace !important;
          width: 100% !important;
          box-sizing: border-box !important;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.5) !important;
        }

        /* Responsive Layout Toggles */
        .layout-vertical {
          display: flex !important;
          flex-direction: column !important;
          gap: 25px !important;
        }

        .layout-horizontal {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 20px !important;
        }

        .neon-title {
          color: #00f3ff !important;
          font-size: 12px !important;
          letter-spacing: 3px !important;
          margin: 0 0 15px 0 !important;
          border-bottom: 1px solid rgba(0, 243, 255, 0.2) !important;
          padding-bottom: 6px !important;
          text-shadow: 0 0 5px #00f3ff !important;
          text-transform: uppercase !important;
        }

        .button-grid {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 12px !important;
        }

        .span-2 {
          grid-column: span 2 !important;
        }

        /* --- BASE BUTTON - UNIFORM STRUCTURE --- */
        button {
          background: rgba(0, 243, 255, 0.05) !important;
          border: 1.5px solid #00f3ff !important;
          color: #00f3ff !important;
          box-shadow: 0 0 5px rgba(0, 243, 255, 0.2), inset 0 0 5px rgba(0, 243, 255, 0.1) !important;
          padding: 12px 10px !important;
          font-family: 'Courier New', Courier, monospace !important;
          font-weight: 900 !important;
          font-size: 11px !important;
          letter-spacing: 1px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          border-radius: 4px !important;
          text-transform: uppercase !important;
          text-align: center !important;
        }

        button:active { 
          transform: scale(0.96) !important; 
        }

        /* Base Cyan Button */
        .btn-cyan {
          border: 1.5px solid #00f3ff !important;
          color: #00f3ff !important;
          background: rgba(0, 243, 255, 0.05) !important;
          box-shadow: 0 0 5px rgba(0, 243, 255, 0.2), inset 0 0 5px rgba(0, 243, 255, 0.1) !important;
        }
        .btn-cyan:hover {
          background: rgba(0, 243, 255, 0.15) !important;
          border-color: #ffffff !important;
          color: #ffffff !important;
          box-shadow: 0 0 10px #ffffff, 0 0 20px #00f3ff, inset 0 0 10px #00f3ff !important;
          text-shadow: 0 0 5px #ffffff !important;
        }

        /* White Action Button (Save) -> NOW NEON BLUE */
        .btn-white {
          border: 1.5px solid #00f3ff !important;
          color: #00f3ff !important;
          background: rgba(0, 243, 255, 0.05) !important;
          box-shadow: 0 0 5px rgba(0, 243, 255, 0.2), inset 0 0 5px rgba(0, 243, 255, 0.1) !important;
        }
        .btn-white:hover {
          background: rgba(0, 243, 255, 0.15) !important;
          border-color: #ffffff !important;
          color: #ffffff !important;
          box-shadow: 0 0 10px #ffffff, 0 0 20px #00f3ff, inset 0 0 10px #00f3ff !important;
          text-shadow: 0 0 8px #ffffff !important;
        }

        /* Danger / Reboot Button -> NOW NEON BLUE */
        .btn-danger { 
          border: 1.5px solid #00f3ff !important; 
          color: #00f3ff !important; 
          background: rgba(0, 243, 255, 0.05) !important;
          box-shadow: 0 0 5px rgba(0, 243, 255, 0.2), inset 0 0 5px rgba(0, 243, 255, 0.1) !important;
        }
        .btn-danger:hover { 
          background: rgba(0, 243, 255, 0.15) !important; 
          border-color: #ffffff !important;
          color: #ffffff !important;
          box-shadow: 0 0 10px #ffffff, 0 0 20px #00f3ff, inset 0 0 10px #00f3ff !important; 
          text-shadow: 0 0 5px #ffffff !important; 
        }

        /* Warning / Repair Button -> NOW NEON BLUE */
        .btn-warning { 
          border: 1.5px solid #00f3ff !important; 
          color: #00f3ff !important; 
          background: rgba(0, 243, 255, 0.05) !important;
          box-shadow: 0 0 5px rgba(0, 243, 255, 0.2), inset 0 0 5px rgba(0, 243, 255, 0.1) !important;
        }
        .btn-warning:hover { 
          background: rgba(0, 243, 255, 0.15) !important; 
          border-color: #ffffff !important;
          color: #ffffff !important;
          box-shadow: 0 0 10px #ffffff, 0 0 20px #00f3ff, inset 0 0 10px #00f3ff !important; 
          text-shadow: 0 0 5px #ffffff !important; 
        }

        /* --- NEON BLUE ENVIRONMENTAL BUTTONS --- */
        .btn-env {
          border: 1.5px solid #00f3ff !important;
          color: #00f3ff !important;
          background: rgba(0, 243, 255, 0.05) !important;
          box-shadow: 0 0 5px rgba(0, 243, 255, 0.2), inset 0 0 5px rgba(0, 243, 255, 0.1) !important;
          transition: all 0.3s ease !important;
        }
        .btn-env:hover {
          background: rgba(0, 243, 255, 0.15) !important;
          border-color: #ffffff !important;
          color: #ffffff !important;
          box-shadow: 0 0 10px #ffffff, 0 0 20px #00f3ff, inset 0 0 10px #00f3ff !important;
          text-shadow: 0 0 5px #ffffff !important;
        }
        .btn-env.active { 
          background: rgba(0, 243, 255, 0.3) !important; 
          border-color: #ffffff !important;
          color: #ffffff !important;
          box-shadow: 0 0 10px #ffffff, 0 0 20px #00f3ff, inset 0 0 10px #00f3ff !important;
          text-shadow: 0 0 5px #ffffff !important;
        }
        
        /* Storm Active Override -> NOW NEON BLUE */
        .btn-env.storm.active { 
          background: rgba(0, 243, 255, 0.3) !important; 
          border-color: #ffffff !important;
          color: #ffffff !important;
          box-shadow: 0 0 10px #ffffff, 0 0 20px #00f3ff, inset 0 0 10px #00f3ff !important;
          text-shadow: 0 0 5px #ffffff !important;
        }
        
        /* Heatwave Active Override -> NOW NEON BLUE */
        .btn-env.heatwave {
          border: 1.5px solid #00f3ff !important;
          color: #00f3ff !important;
          background: rgba(0, 243, 255, 0.05) !important;
          box-shadow: 0 0 5px rgba(0, 243, 255, 0.2), inset 0 0 5px rgba(0, 243, 255, 0.1) !important;
        }
        .btn-env.heatwave.active { 
          background: rgba(0, 243, 255, 0.3) !important; 
          border-color: #ffffff !important;
          color: #ffffff !important;
          box-shadow: 0 0 10px #ffffff, 0 0 20px #00f3ff, inset 0 0 10px #00f3ff !important;
          text-shadow: 0 0 5px #ffffff !important;
        }

        @media (max-width: 900px) {
          .layout-horizontal {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}