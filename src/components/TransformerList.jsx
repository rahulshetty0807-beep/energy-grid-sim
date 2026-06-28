import React from 'react';
import useStore from '../engine/gameState';

export default function TransformerList() {
  const { gridGroups, isBlackout } = useStore();

  const getStatusStyle = (status, isBlackout) => {
    if (isBlackout) return { color: '#ff1a1a', shadow: 'none', bg: 'rgba(255, 26, 26, 0.05)' };
    if (status === 'ONLINE') return { color: '#00f3ff', shadow: '0 0 15px rgba(0, 243, 255, 0.15)', bg: 'rgba(0, 243, 255, 0.02)' };
    if (status === 'DEGRADED') return { color: '#ffb700', shadow: '0 0 15px rgba(255, 183, 0, 0.15)', bg: 'rgba(255, 183, 0, 0.03)' };
    return { color: '#ff1a1a', shadow: '0 0 15px rgba(255, 26, 26, 0.25)', bg: 'rgba(255, 26, 26, 0.08)' };
  };

  return (
    <div className="transformer-list-container">
      
      {/* MAPPING THE 5 GROUPS OF 3 NODES EACH */}
      {Object.entries(gridGroups).map(([setName, nodes], index) => {
        if (!nodes || nodes.length === 0) return null;
        
        return (
          <div key={setName} className="sector-group">
            <h3 className="sector-header">
              <span className="sector-title">CLUSTER {index + 1}</span>
              <span className="node-count">NODES: {nodes.length}</span>
            </h3>
            
            <div className="node-grid">
              {nodes.map(tx => {
                const style = getStatusStyle(tx.status, isBlackout);
                const loadRatio = tx.load / tx.cap;
                const isOverloaded = loadRatio > 0.9 && !isBlackout;
                
                return (
                  <div 
                    key={tx.id} 
                    className={`node-card ${isOverloaded ? 'card-danger-pulse' : ''}`}
                    style={{
                      background: style.bg,
                      borderColor: style.color,
                      boxShadow: style.shadow,
                      '--theme-color': style.color
                    }}
                  >
                    {/* Header */}
                    <div className="card-header">
                      <div>
                        <div className="tx-id" style={{ color: style.color, textShadow: `0 0 8px ${style.color}` }}>
                          {tx.id}
                        </div>
                        <div className="tx-role">{tx.role}</div>
                      </div>
                      <div 
                        className="status-badge"
                        style={{ 
                          background: isBlackout ? 'transparent' : `${style.color}20`, 
                          color: isBlackout ? style.color : '#fff', 
                          borderColor: style.color,
                          textShadow: isBlackout ? `0 0 5px ${style.color}` : 'none'
                        }}
                      >
                        {isBlackout ? 'OFFLINE' : tx.status}
                      </div>
                    </div>

                    {/* Telemetry Grid */}
                    <div className="card-telemetry">
                      
                      {/* Load Bar (Spans full width) */}
                      <div className="telemetry-full-row">
                        <div className="telemetry-label-row">
                          <span className="label-text">POWER LOAD</span>
                          <span className="value-text" style={{ color: isOverloaded ? '#ff1a1a' : '#fff' }}>
                            {tx.load.toFixed(1)} / {tx.cap} MW
                          </span>
                        </div>
                        <div className="load-bar-bg">
                          <div 
                            className="load-bar-fill" 
                            style={{ 
                              width: `${Math.min(100, loadRatio * 100)}%`, 
                              background: isOverloaded ? '#ff1a1a' : style.color,
                              boxShadow: `0 0 8px ${isOverloaded ? '#ff1a1a' : style.color}`
                            }} 
                          />
                        </div>
                      </div>

                      {/* Factors (2 Columns) */}
                      <div className="telemetry-data">
                        <div className="label-text">EFFICIENCY</div>
                        <div className="value-text" style={{ color: tx.eff < 0.8 && !isBlackout ? '#ffb700' : '#fff' }}>
                          {(tx.eff * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="telemetry-data">
                        <div className="label-text">CORE TEMP</div>
                        <div className="value-text" style={{ color: tx.temp > 90 && !isBlackout ? '#ff1a1a' : '#fff' }}>
                          {tx.temp.toFixed(1)}°C
                        </div>
                      </div>

                      <div className="telemetry-data">
                        <div className="label-text">RATED VOLTAGE</div>
                        <div className="value-text" style={{ color: '#00f3ff' }}>
                          {tx.voltage}
                        </div>
                      </div>

                      <div className="telemetry-data">
                        <div className="label-text">COOLING SYS</div>
                        <div className="value-text" style={{ color: tx.cooling < 80 && !isBlackout ? '#ffb700' : '#fff' }}>
                          {tx.cooling.toFixed(0)}%
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* --- FORCED NEON CSS STYLING --- */}
      <style>{`
        .transformer-list-container {
          background: #0a0a0f !important;
          padding: 25px !important;
          border-radius: 8px !important;
          border: 1px solid #1a1a2e !important;
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.8) !important;
          height: 600px !important; 
          overflow-y: auto !important;
          box-sizing: border-box !important;
        }

        /* Custom Scrollbar */
        .transformer-list-container::-webkit-scrollbar {
          width: 8px !important;
        }
        .transformer-list-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.5) !important;
          border-radius: 4px !important;
        }
        .transformer-list-container::-webkit-scrollbar-thumb {
          background: #00f3ff !important;
          border-radius: 4px !important;
        }

        .sector-group {
          margin-bottom: 35px !important;
        }

        .sector-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-end !important;
          border-bottom: 2px solid rgba(0, 243, 255, 0.3) !important;
          padding-bottom: 10px !important;
          margin: 0 0 20px 0 !important;
        }

        .sector-title {
          color: #ffffff !important;
          font-size: 16px !important;
          letter-spacing: 3px !important;
          text-transform: uppercase !important;
          font-family: 'Courier New', Courier, monospace !important;
          text-shadow: 0 0 5px rgba(255,255,255,0.3) !important;
        }

        .node-count {
          font-size: 11px !important;
          color: #00f3ff !important;
          letter-spacing: 2px !important;
          font-family: 'Courier New', Courier, monospace !important;
        }

        .node-grid {
          display: grid !important;
          grid-template-columns: repeat(3, 1fr) !important;
          gap: 20px !important;
        }

        .node-card {
          border-width: 1px !important;
          border-style: solid !important;
          border-radius: 8px !important;
          padding: 15px !important;
          position: relative !important;
          overflow: hidden !important;
          transition: all 0.3s ease !important;
          font-family: 'Courier New', Courier, monospace !important;
        }

        .node-card:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 5px 20px rgba(0,0,0,0.8), inset 0 0 25px rgba(0, 243, 255, 0.1) !important;
        }

        .card-danger-pulse {
          animation: card-pulse 1.5s infinite alternate !important;
        }

        @keyframes card-pulse {
          0% { box-shadow: 0 0 5px rgba(255, 26, 26, 0.2); }
          100% { box-shadow: 0 0 20px rgba(255, 26, 26, 0.6), inset 0 0 10px rgba(255, 26, 26, 0.2); }
        }

        .card-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: flex-start !important;
          margin-bottom: 15px !important;
          border-bottom: 1px solid rgba(255,255,255,0.1) !important;
          padding-bottom: 10px !important;
        }

        .tx-id {
          font-size: 18px !important;
          font-weight: 900 !important;
          letter-spacing: 2px !important;
        }

        .tx-role {
          color: #888 !important;
          font-size: 10px !important;
          margin-top: 4px !important;
          letter-spacing: 1px !important;
          text-transform: uppercase !important;
        }

        .status-badge {
          border-width: 1px !important;
          border-style: solid !important;
          font-size: 10px !important;
          font-weight: 900 !important;
          padding: 4px 8px !important;
          border-radius: 4px !important;
          letter-spacing: 1px !important;
        }

        .card-telemetry {
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 12px !important;
        }

        .telemetry-full-row {
          grid-column: span 2 !important;
        }

        .telemetry-label-row {
          display: flex !important;
          justify-content: space-between !important;
          margin-bottom: 6px !important;
        }

        .label-text {
          color: #00f3ff !important;
          opacity: 0.7 !important;
          font-size: 10px !important;
          letter-spacing: 1px !important;
          font-weight: bold !important;
        }

        .value-text {
          font-size: 14px !important;
          font-weight: bold !important;
          text-shadow: 0 0 3px rgba(255,255,255,0.4) !important;
        }

        .load-bar-bg {
          width: 100% !important;
          height: 6px !important;
          background: #000000 !important;
          border-radius: 3px !important;
          border: 1px solid #1a1a2e !important;
          overflow: hidden !important;
        }

        .load-bar-fill {
          height: 100% !important;
          border-radius: 3px !important;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        .telemetry-data {
          display: flex !important;
          flex-direction: column !important;
          gap: 4px !important;
        }

        @media (max-width: 1200px) {
          .node-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .node-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}