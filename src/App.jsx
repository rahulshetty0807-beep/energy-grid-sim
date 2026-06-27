import React, { useEffect, useState, useRef } from 'react';
import useStore from './engine/gameState';

// Importing your simulation engine
import { startSimulation, stopSimulation } from './engine/simulationEngine';

// Import all your new UI Components
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
    // 1. Load any saved state from localStorage on startup
    loadGame();
    
    // 2. Start the physics and failure loop
    startSimulation();
    
    // 3. Cleanup on shutdown
    return () => stopSimulation();
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
        
        {/* Header */}
        <h1 style={{ 
          borderBottom: '2px solid #333', 
          paddingBottom: '10px', 
          marginBottom: '30px',
          color: '#00ccff',
          letterSpacing: '2px'
        }}>
          GLOBAL GRID COMMAND SYSTEM
        </h1>
        
        {/* Main Grid Layout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '30px' 
        }}>
          
          {/* Left Column: Real-time Status & Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <MasterVisualizer />
            <Dashboard />
            <SystemLog />
          </div>

          {/* Right Column: Analytics & Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <GridChart />
            <ControlPanel />
          </div>
          
        </div>

        {/* You can now add your components here */}
        <Dashboard />
        <ControlPanel />
        <MasterVisualizer />
        <GridChart />
        <SystemLog />

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