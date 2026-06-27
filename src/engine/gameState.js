import { create } from 'zustand';

// Initial Transformer Configuration
const initialTransformers = [
  ...Array.from({length: 3}, (_, i) => ({ id: `TX-G${i+1}`, sector: 'Sector 1: Generation Core', role: 'Gen Node', cap: 150, load: 0, temp: 35, status: 'ONLINE', voltage: '345kV', cooling: 100, eff: 1 })),
  ...Array.from({length: 3}, (_, i) => ({ id: `SUB-${i}`, sector: 'Sector 2: Heavy Transmission', role: 'Substation', cap: 250, load: 0, temp: 40, status: 'ONLINE', voltage: '500kV', cooling: 100, eff: 1 })),
  ...Array.from({length: 3}, (_, i) => ({ id: `DT-I${i+1}`, sector: 'Sector 3: Industrial District', role: 'Industrial', cap: 150, load: 0, temp: 45, status: 'ONLINE', voltage: '13.8kV', cooling: 100, eff: 1 })),
  ...Array.from({length: 3}, (_, i) => ({ id: `DT-C${i+1}`, sector: 'Sector 4: Commercial Hub', role: 'Commercial', cap: 100, load: 0, temp: 35, status: 'ONLINE', voltage: '4.16kV', cooling: 100, eff: 1 })),
  ...Array.from({length: 3}, (_, i) => ({ id: `DT-R${i+1}`, sector: 'Sector 5: Residential Grid', role: 'Residential', cap: 80, load: 0, temp: 30, status: 'ONLINE', voltage: '240V', cooling: 100, eff: 1 }))
];

const useStore = create((set) => ({
  time: 0, 
  batteryLevel: 50, 
  demand: 500, 
  gridEfficiency: 1.0, 
  isBlackout: false,
  logs: ["Telemetry System Online..."], 
  weather: 'CLEAR',
  transformers: initialTransformers,
  settings: { isPaused: false, solarCapacity: 250, windCapacity: 200 }, // Added missing capacity keys

  // Unified action to update simulation data
  // Add this alias in your gameState.js (next to updateGrid)
  updateState: (newData) => set((state) => ({ ...state, ...newData })),
  
  // NEW: Add these to match your simulationEngine.js calls
  addLog: (msg) => set((state) => ({ logs: [msg, ...state.logs].slice(0, 20) })),
  triggerWeatherEvent: (weather) => set({ weather }),

  // UI Actions
  togglePause: () => set((state) => ({ settings: { ...state.settings, isPaused: !state.settings.isPaused } })),
  repairGrid: () => set((state) => ({
    isBlackout: false,
    transformers: state.transformers.map(t => ({ ...t, status: 'ONLINE', temp: 35, load: 0, eff: 1 }))
  }))
}));

export default useStore;