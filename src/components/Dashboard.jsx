import React from 'react';
import useStore from '../engine/gameState';

const formatTime = (t) => {
  const h = Math.floor(t).toString().padStart(2, '0');
  const m = Math.floor((t % 1) * 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

export default function Dashboard() {
  // Use optional chaining for all store properties to be safe
  const { time, batteryLevel, demand, gridEfficiency, score, settings } = useStore();

  const statItemStyle = {
    padding: '15px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid #1a1a2e',
    borderRadius: '4px'
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '15px', 
      background: '#0a0a0f', 
      padding: '20px', 
      borderRadius: '8px',
      border: '1px solid #1a1a2e'
    }}>
      <div style={statItemStyle}>
        <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>Sys Time</div>
        <h2 style={{ margin: '5px 0 0 0', color: '#fff', fontSize: '24px' }}>{formatTime(time ?? 0)}</h2>
      </div>

      <div style={statItemStyle}>
        <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>Grid Score</div>
        <h2 style={{ margin: '5px 0 0 0', color: '#00f3ff', fontSize: '24px' }}>{Math.floor(score ?? 0)}</h2>
      </div>

      <div style={statItemStyle}>
        <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>Battery / Load</div>
        <div style={{ marginTop: '5px', color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
          {(batteryLevel ?? 0).toFixed(1)}% <span style={{ color: '#444' }}>/</span> {(demand ?? 0).toFixed(0)} MW
        </div>
      </div>

      <div style={statItemStyle}>
        <div style={{ color: '#666', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>Grid Health</div>
        <div style={{ 
          marginTop: '5px', 
          color: (gridEfficiency ?? 1) < 0.5 ? '#ff2a2a' : '#00f3ff', 
          fontSize: '16px', 
          fontWeight: '900' 
        }}>
          {((gridEfficiency ?? 1) * 100).toFixed(0)}%
        </div>
      </div>

      <div style={{ gridColumn: 'span 2', padding: '10px 15px', background: 'rgba(0, 243, 255, 0.05)', borderRadius: '4px', border: '1px solid #1a1a2e', fontSize: '12px', color: '#888' }}>
        <strong>CAPACITIES:</strong> 
        {/* Safe navigation for nested settings object */}
        SOLAR ({settings?.solarCapacity?.toFixed(0) ?? 0}) | 
        WIND ({settings?.windCapacity?.toFixed(0) ?? 0})
      </div>
    </div>
  );
}