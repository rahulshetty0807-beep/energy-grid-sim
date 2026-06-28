import useStore from '../engine/gameState';
import React, { useState, useEffect } from 'react'; // Ensure 'useEffect' is included here

export default function RiskAlert() {
  const transformers = useStore(state => state.transformers);
  const sendCommand = useStore(state => state.sendCommand);
  const [acknowledged, setAcknowledged] = useState([]);
  // Automatically un-acknowledge nodes that have recovered
  useEffect(() => {
    const recoveredIds = transformers
      .filter(t => t.risk < 50)
      .map(t => t.id);
      
    if (recoveredIds.length > 0) {
      setAcknowledged(prev => prev.filter(id => !recoveredIds.includes(id)));
    }
  }, [transformers]);

  // Filter only HIGH risk nodes that haven't been dismissed
  const criticalNodes = transformers
    .filter(t => t.risk > 80 && !acknowledged.includes(t.id))
    .sort((a, b) => b.risk - a.risk); // Sort by highest risk first

  if (criticalNodes.length === 0) return null;

  const dismiss = (id) => setAcknowledged([...acknowledged, id]);

  return (
    <div className="alarm-matrix">
      <div className="alarm-header">
        <span className="blink-dot" />
        <h3>PREDICTIVE FAILURE IMMINENT</h3>
      </div>
      
      <div className="alarm-list">
        {criticalNodes.map(node => (
          <div key={node.id} className="alarm-card">
            <div className="alarm-info">
              <strong>{node.id}</strong> | RISK: {Math.floor(node.risk)}%
              <div className="alarm-sub">TEMP: {node.temp.toFixed(1)}°C | LOAD: {node.load.toFixed(0)}MW</div>
            </div>
            <div className="alarm-actions">
              <button className="btn-repair" onClick={() => sendCommand(node.id, 'REBOOT')}>REPAIR</button>
              <button className="btn-dismiss" onClick={() => dismiss(node.id)}>X</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .alarm-matrix {
          position: fixed; top: 100px; right: 20px; width: 320px;
          background: rgba(20, 0, 0, 0.9); border-left: 4px solid #ff1a1a;
          padding: 20px; z-index: 9999; backdrop-filter: blur(15px);
          box-shadow: 0 10px 40px rgba(255,0,0,0.3);
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        
        .alarm-header { display: flex; align-items: center; gap: 10px; color: #ff1a1a; margin-bottom: 15px; }
        .blink-dot { width: 12px; height: 12px; border-radius: 50%; background: #ff1a1a; animation: pulse 1s infinite; }
        
        .alarm-card { 
          background: rgba(255, 26, 26, 0.1); border: 1px solid #ff1a1a;
          margin-bottom: 10px; padding: 10px; display: flex; justify-content: space-between;
          align-items: center; border-radius: 4px;
        }
        .alarm-info { font-size: 13px; color: #fff; }
        .alarm-sub { font-size: 10px; color: #ffcccc; margin-top: 4px; }
        
        .btn-repair { background: #ff1a1a; color: white; border: none; padding: 5px 10px; cursor: pointer; font-size: 10px; margin-right: 5px; }
        .btn-dismiss { background: transparent; color: #ff1a1a; border: 1px solid #ff1a1a; padding: 5px 8px; cursor: pointer; }
        
        @keyframes pulse { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}