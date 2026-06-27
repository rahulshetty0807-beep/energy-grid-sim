import { useEffect } from 'react';
import useStore from './engine/gameState';
import { startSimulation, stopSimulation } from './engine/simulationEngine';

// Import all your UI Components
import MasterVisualizer from './components/MasterVisualizer';
import Dashboard from './components/Dashboard';
import SystemLog from './components/SystemLog';
import GridChart from './components/GridChart';
import ControlPanel from './components/ControlPanel';

export default function App() {
  const loadGame = useStore((state) => state.loadGame);

  useEffect(() => {
    loadGame();
    startSimulation();
    return () => stopSimulation();
  }, [loadGame]);

  return (
    <div style={{ 
      background: '#0f0f11', 
      minHeight: '100vh', 
      padding: '40px', 
      color: '#ffffff', 
      fontFamily: 'sans-serif' 
    }}>
      
      <div style={{ maxWidth: '1000px', margin: 'auto' }}>
        
        {/* Corrected Header Section */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '2px solid #222', 
          paddingBottom: '15px', 
          marginBottom: '30px' 
        }}>
          <div>
            <h1 style={{ margin: 0, color: '#00ccff', letterSpacing: '2px', fontSize: '24px' }}>
              GRID OPERATING SYSTEM <span style={{ color: '#555', fontSize: '14px' }}>v1.2.0</span>
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#666', fontFamily: 'monospace', fontSize: '12px' }}>
              SECURE NODE CONNECTION // AUTH_OP_042
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px', fontFamily: 'monospace', fontSize: '12px' }}>
            <div style={{ background: '#1a1a24', padding: '6px 12px', borderRadius: '4px', border: '1px solid #334' }}>
              CORE_NET: <span style={{ color: '#00ff00' }}>● ONLINE</span>
            </div>
            <div style={{ background: '#1a1a24', padding: '6px 12px', borderRadius: '4px', border: '1px solid #334' }}>
              SYNC_HZ: <span style={{ color: '#00ccff' }}>60.00 Hz</span>
            </div>
          </div>
        </div>

        {/* You can now add your components here */}
        <Dashboard />
        <ControlPanel />
        <MasterVisualizer />
        <GridChart />
        <SystemLog />

      </div>
    </div>
  );
}