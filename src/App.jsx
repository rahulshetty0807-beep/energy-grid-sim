import React, { useEffect, useState, useRef } from 'react';
import useStore from './engine/gameState';

// Importing your simulation engine
import { startSimulation, stopSimulation } from './engine/simulationEngine';

// Importing all UI Components
import MasterVisualizer from './components/MasterVisualizer';
import Dashboard from './components/Dashboard';
import SystemLog from './components/SystemLog';
import GridChart from './components/GridChart';
import ControlPanel from './components/ControlPanel';
import TransformerList from './components/TransformerList';

export default function App() {
  const loadGame = useStore((state) => state.loadGame);
  const [activeTab, setActiveTab] = useState('TELEMETRY');
  const isSimRunning = useRef(false);

  // 1. Unified Simulation Lifecycle
  useEffect(() => {
    // Ensure we only initialize the store and simulation once
    if (typeof loadGame === 'function') {
      loadGame();
    }
    
    if (!isSimRunning.current) {
      startSimulation();
      isSimRunning.current = true;
    }
    
    // Cleanup on component unmount
    return () => {
      stopSimulation();
      isSimRunning.current = false;
    };
  }, [loadGame]);

  const getNavBtnStyle = (tabName) => ({
    padding: '12px 30px',
    background: activeTab === tabName ? '#00f3ff' : '#0a0a0f',
    color: activeTab === tabName ? '#000' : '#00f3ff',
    border: `1px solid #00f3ff`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '900',
    letterSpacing: '2px',
    transition: 'all 0.2s ease',
    boxShadow: activeTab === tabName ? '0 0 15px rgba(0, 243, 255, 0.4)' : 'none'
  });

  return (
    <div className="app-container" style={{ 
      background: '#000', 
      minHeight: '100vh', 
      padding: '30px', 
      color: '#fff', 
      fontFamily: '"Courier New", Courier, monospace' 
    }}>
      
      <div style={{ maxWidth: '1400px', margin: 'auto' }}>
        
        {/* --- GLOBAL NAVIGATION HEADER --- */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '2px solid rgba(0, 243, 255, 0.3)', 
          paddingBottom: '20px', 
          marginBottom: '35px' 
        }}>
          <div>
            <h1 style={{ 
              color: '#00f3ff', 
              letterSpacing: '4px', 
              margin: '0 0 5px 0', 
              fontSize: '28px', 
              textShadow: '0 0 10px #00f3ff' 
            }}>
              GLOBAL GRID COMMAND
            </h1>
            <div style={{ fontSize: '12px', color: '#666', letterSpacing: '2px' }}>
              SECURE UPLINK ESTABLISHED // SECTOR: OMEGA
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '20px' }}>
            <button style={getNavBtnStyle('TELEMETRY')} onClick={() => setActiveTab('TELEMETRY')}>
              DATA TELEMETRY
            </button>
            <button style={getNavBtnStyle('GRID')} onClick={() => setActiveTab('GRID')}>
              3D HOLOGRAPHICS
            </button>
          </div>
        </header>
        
        {/* --- VIEW TRANSITION CONTAINER --- */}
        <main className="view-transition">
          {activeTab === 'TELEMETRY' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <Dashboard />
                <TransformerList />
                <SystemLog />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <GridChart />
                <ControlPanel />
              </div>
            </div>
          ) : (
            <div>
              <MasterVisualizer />
              <div style={{ marginTop: '30px', maxWidth: '800px', margin: '30px auto 0' }}>
                 <ControlPanel layout="horizontal" />
              </div>
            </div>
          )}
        </main>

      </div>

      {/* Global Transition Animations & Scrollbar Styles */}
      <style>{`
        .view-transition {
          animation: fadeSlideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #00f3ff; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #fff; }
      `}</style>
    </div>
  );
}