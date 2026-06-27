import { useEffect, useState } from 'react';
import useStore from './engine/gameState';
import { startSimulation, stopSimulation } from './engine/simulationEngine';

// Import all UI Components
import MasterVisualizer from './components/MasterVisualizer';
import Dashboard from './components/Dashboard';
import SystemLog from './components/SystemLog';
import GridChart from './components/GridChart';
import ControlPanel from './components/ControlPanel';

export default function App() {
  const loadGame = useStore((state) => state.loadGame);
  
  // This state controls which "Page" we are looking at
  const [activeTab, setActiveTab] = useState('TELEMETRY');

  useEffect(() => {
    loadGame();
    startSimulation();
    return () => stopSimulation();
  }, [loadGame]);

  // Styles for our Navigation Buttons
  const navBtnStyle = (tabName) => ({
    padding: '12px 25px',
    background: activeTab === tabName ? '#00ccff' : '#1e1e24',
    color: activeTab === tabName ? '#000' : '#fff',
    border: `1px solid ${activeTab === tabName ? '#00ccff' : '#333'}`,
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    letterSpacing: '1px',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '30px', color: '#ffffff', fontFamily: 'sans-serif' }}>
      
      <div style={{ maxWidth: '1200px', margin: 'auto' }}>
        
        {/* --- NAVIGATION HEADER --- */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #333', 
          paddingBottom: '20px', 
          marginBottom: '30px' 
        }}>
          <h1 style={{ color: '#00ccff', letterSpacing: '2px', margin: 0, fontSize: '24px' }}>
            GLOBAL GRID COMMAND SYSTEM
          </h1>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button style={navBtnStyle('TELEMETRY')} onClick={() => setActiveTab('TELEMETRY')}>
              📡 TELEMETRY ENGINE
            </button>
            <button style={navBtnStyle('GRID')} onClick={() => setActiveTab('GRID')}>
              ⚡ POWER GRID NODES
            </button>
          </div>
        </div>
        
        {/* --- PAGE 1: TELEMETRY ENGINE (Main Dashboard) --- */}
        {activeTab === 'TELEMETRY' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Dashboard />
              <SystemLog />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <GridChart />
              <ControlPanel />
            </div>
          </div>
        )}

        {/* --- PAGE 2: POWER GRID (The 15-Node Transformer Map) --- */}
        {activeTab === 'GRID' && (
          <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
            <MasterVisualizer />
            
            {/* Added a control panel here too, so you can repair the grid while looking at it */}
            <div style={{ marginTop: '20px', maxWidth: '600px', margin: '20px auto 0' }}>
               <ControlPanel />
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}