import React from 'react';
import useStore from '../engine/gameState';

export default function TransformerList() {
  const { transformers, isBlackout } = useStore();

  const sectors = [
    'Sector 1: Generation Core',
    'Sector 2: Heavy Transmission',
    'Sector 3: Industrial District',
    'Sector 4: Commercial Hub',
    'Sector 5: Residential Grid'
  ];

  const getStatusStyle = (status, isBlackout) => {
    if (isBlackout) return { color: '#ff2a2a', shadow: 'none', bg: '#200000' };
    if (status === 'ONLINE') return { color: '#00f3ff', shadow: '0 0 10px rgba(0,243,255,0.3)', bg: '#001a1a' };
    if (status === 'DEGRADED') return { color: '#ffea00', shadow: '0 0 10px rgba(255,234,0,0.3)', bg: '#222200' };
    return { color: '#ff2a2a', shadow: '0 0 15px rgba(255,42,42,0.6)', bg: '#330000' };
  };

  return (
    <div style={{ background: '#020205', padding: '20px', borderRadius: '8px', border: '1px solid #1a1a2e' }}>
      
      {sectors.map(sectorName => {
        const nodes = transformers.filter(t => t.sector === sectorName);
        
        return (
          <div key={sectorName} style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              color: '#fff', fontSize: '16px', letterSpacing: '3px', textTransform: 'uppercase',
              borderBottom: '2px solid #333', paddingBottom: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between'
            }}>
              {sectorName}
              <span style={{ fontSize: '12px', color: '#666' }}>NODES: 3</span>
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {nodes.map(tx => {
                const style = getStatusStyle(tx.status, isBlackout);
                const loadRatio = tx.load / tx.cap;
                
                return (
                  <div key={tx.id} style={{
                    background: style.bg,
                    border: `1px solid ${style.color}`,
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: style.shadow,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                      <div>
                        <div style={{ color: style.color, fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>{tx.id}</div>
                        <div style={{ color: '#aaa', fontSize: '11px', marginTop: '4px', letterSpacing: '1px' }}>{tx.role}</div>
                      </div>
                      <div style={{ 
                        background: isBlackout ? 'transparent' : style.color, 
                        color: isBlackout ? style.color : '#000', 
                        border: `1px solid ${style.color}`,
                        fontSize: '10px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px' 
                      }}>
                        {isBlackout ? 'OFFLINE' : tx.status}
                      </div>
                    </div>

                    {/* Telemetry Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', fontFamily: 'monospace' }}>
                      
                      {/* Load Bar */}
                      <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ccc', marginBottom: '4px' }}>
                          <span>POWER LOAD</span>
                          <span style={{ color: loadRatio > 0.9 ? '#ff2a2a' : '#fff' }}>{tx.load.toFixed(1)} / {tx.cap} MW</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#111', borderRadius: '3px' }}>
                          <div style={{ width: `${Math.min(100, loadRatio * 100)}%`, height: '100%', background: loadRatio > 0.9 ? '#ff2a2a' : style.color, borderRadius: '3px', transition: 'width 0.3s' }} />
                        </div>
                      </div>

                      {/* Factors */}
                      <div>
                        <div style={{ color: '#666', fontSize: '10px' }}>EFFICIENCY</div>
                        <div style={{ color: tx.eff < 0.8 ? '#ffea00' : '#fff', fontSize: '14px' }}>{(tx.eff * 100).toFixed(1)}%</div>
                      </div>
                      
                      <div>
                        <div style={{ color: '#666', fontSize: '10px' }}>CORE TEMP</div>
                        <div style={{ color: tx.temp > 90 ? '#ff2a2a' : '#fff', fontSize: '14px' }}>{tx.temp.toFixed(1)}°C</div>
                      </div>

                      <div>
                        <div style={{ color: '#666', fontSize: '10px' }}>RATED VOLTAGE</div>
                        <div style={{ color: '#00f3ff', fontSize: '14px' }}>{tx.voltage}</div>
                      </div>

                      <div>
                        <div style={{ color: '#666', fontSize: '10px' }}>COOLING SYS</div>
                        <div style={{ color: tx.cooling < 80 ? '#ffea00' : '#fff', fontSize: '14px' }}>{tx.cooling.toFixed(0)}%</div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}