import React, { useEffect, useState } from 'react';
import useStore from './engine/gameState';
import { useTelemetrySocket } from './engine/useTelemetrySocket'; 
import omegaConfig from './config/omegaGrid.json'; 
import RiskAlert from './components/RiskAlert';

// Importing all UI Components
import MasterVisualizer from './components/MasterVisualizer';
import Dashboard from './components/Dashboard';
import SystemLog from './components/SystemLog';
import GridChart from './components/GridChart';
import ControlPanel from './components/ControlPanel';
import TransformerList from './components/TransformerList';
import GridAutopilot from './components/GridAutopilot';

export default function App() {
  // 1. Pull the topology loader from the store
  const loadTopology = useStore((state) => state.loadTopology);
  
  // 2. Establish the Global WebSocket Connection immediately on mount
  const uplinkStatus = useTelemetrySocket('ws://localhost:8080');
  
  const [activeTab, setActiveTab] = useState('TELEMETRY');

  // 3. Unified Initialization Lifecycle
  useEffect(() => {
    // Inject the JSON Grid Blueprint into the Engine once on boot.
    // The WebSocket will take over all state updates from here.
    if (typeof loadTopology === 'function') {
      loadTopology(omegaConfig);
      console.log("Grid Blueprint Loaded. Handing control to SCADA Uplink...");
    }
  }, [loadTopology]);

  // Helper for dynamic UI colors based on server connection
  const getStatusColor = () => {
    if (uplinkStatus === 'CONNECTED') return '#00f3ff';
    if (uplinkStatus === 'RECONNECTING') return '#ffb700';
    return '#ff1a1a';
  };

  const getNavBtnStyle = (tabName) => ({
    padding: '12px 30px',
    background: activeTab === tabName ? 'rgba(0, 243, 255, 0.15)' : 'rgba(0, 243, 255, 0.02)',
    color: activeTab === tabName ? '#ffffff' : '#00f3ff', 
    border: `1px solid ${activeTab === tabName ? '#00f3ff' : 'rgba(0, 243, 255, 0.4)'}`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    letterSpacing: '2px',
    transition: 'all 0.2s ease',
    boxShadow: activeTab === tabName ? '0 0 10px rgba(0, 243, 255, 0.2)' : '0 0 6px rgba(0, 243, 255, 0.1)',
    textShadow: activeTab === tabName ? '0 0 8px #ffffff' : '0 0 4px rgba(0, 243, 255, 0.4)'
  });

  return (
    <div className="app-container" style={{ 
      background: '#000', 
      minHeight: '100vh', 
      padding: '30px', 
      color: '#fff', 
      fontFamily: '"Courier New", Courier, monospace',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* --- GLOBAL SERVICES: These run regardless of the active view --- */}
      <RiskAlert />
      <GridAutopilot />

      
      
      <div style={{ maxWidth: '1400px', width: '100%', margin: 'auto', flex: 1 }}>
        
        {/* --- GLOBAL NAVIGATION HEADER --- */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: `2px solid ${getStatusColor()}50`, 
          paddingBottom: '20px', 
          marginBottom: '35px',
          transition: 'border-color 0.3s ease'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#aaa', letterSpacing: '2px' }}>
              <div style={{ 
                width: '8px', height: '8px', borderRadius: '50%', 
                background: getStatusColor(), 
                boxShadow: `0 0 8px ${getStatusColor()}`,
                animation: uplinkStatus === 'CONNECTED' ? 'blink 1.5s infinite' : 'none'
              }} />
              <span style={{ color: getStatusColor(), fontWeight: 'bold' }}>
                UPLINK: {uplinkStatus}
              </span>
              <span> // SECTOR: OMEGA</span>
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
        <main className="view-transition" style={{ width: '100%' }}>
          {activeTab === 'TELEMETRY' ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 0.6fr', 
              gap: '30px',
              alignItems: 'start'
            }}>
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
            <div style={{ width: '100%' }}>
              <MasterVisualizer />
              <div style={{ marginTop: '30px', maxWidth: '800px', margin: '30px auto 0' }}>
                 <ControlPanel layout="horizontal" />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Transition Animations, Box Sizing, and Scrollbar Styles */}
      <style>{`
      * { box-sizing: border-box; }
      
      .view-transition {
        animation: fadeSlideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        width: 100%;
      }
      
      @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }

      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #0a0a0a; }
      ::-webkit-scrollbar-thumb { background: #00f3ff; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #fff; }
      
      /* Master Theme Overrides */
      .app-container {
        background: #020205 !important;
      }

      .dashboard-container, .system-log-container, .transformer-list-container, .control-panel, .node-card {
        border: 1px solid #00f3ff !important;
        background: rgba(0, 10, 15, 0.8) !important;
        box-shadow: 0 0 10px rgba(0, 243, 255, 0.3), inset 0 0 15px rgba(0, 243, 255, 0.1) !important;
        backdrop-filter: blur(10px);
      }

      .neon-title, h1, h3 {
        text-shadow: 0 0 10px #00f3ff, 0 0 20px #00f3ff !important;
        color: #ffffff !important; 
      }
      `}</style>
      
    </div>
  );
}