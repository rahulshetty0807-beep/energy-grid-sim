import { create } from 'zustand';

const initialTransformers = [
  ...Array.from({length: 3}, (_, i) => ({ id: `TX-G${i+1}`, sector: 'Sector 1: Generation Core', role: 'Gen Node', cap: 150, load: 0, temp: 35, status: 'ONLINE', voltage: '345kV', cooling: 100, eff: 1 })),
  ...Array.from({length: 3}, (_, i) => ({ id: `SUB-${i}`, sector: 'Sector 2: Heavy Transmission', role: 'Substation', cap: 250, load: 0, temp: 40, status: 'ONLINE', voltage: '500kV', cooling: 100, eff: 1 })),
  ...Array.from({length: 3}, (_, i) => ({ id: `DT-I${i+1}`, sector: 'Sector 3: Industrial District', role: 'Industrial', cap: 150, load: 0, temp: 45, status: 'ONLINE', voltage: '13.8kV', cooling: 100, eff: 1 })),
  ...Array.from({length: 3}, (_, i) => ({ id: `DT-C${i+1}`, sector: 'Sector 4: Commercial Hub', role: 'Commercial', cap: 100, load: 0, temp: 35, status: 'ONLINE', voltage: '4.16kV', cooling: 100, eff: 1 })),
  ...Array.from({length: 3}, (_, i) => ({ id: `DT-R${i+1}`, sector: 'Sector 5: Residential Grid', role: 'Residential', cap: 80, load: 0, temp: 30, status: 'ONLINE', voltage: '240V', cooling: 100, eff: 1 }))
];

const useStore = create((set) => ({
  // Core State
  time: 0, 
  batteryLevel: 50, 
  demand: 500, 
  gridEfficiency: 1.0, 
  isBlackout: false,
  score: 0,
  history: [], 
  logs: ["Telemetry System Online..."], 
  weather: 'CLEAR',
  transformers: initialTransformers,
  settings: { isPaused: false, solarCapacity: 250, windCapacity: 200, speed: 1 },

  // Bulletproof Unified State Update
  updateState: (newData) => set((state) => {
    // 1. Safety Guard: Check if newData is valid
    if (!newData) return state;

    // 2. Extract batteryLevel with a fallback to avoid undefined/NaN errors
    const currentBattery = typeof newData.batteryLevel === 'number' ? newData.batteryLevel : state.batteryLevel;
    
    // 3. Prevent history from becoming corrupted
    const cleanBatteryValue = parseFloat(currentBattery.toFixed(1));
    const newHistory = [...state.history, { battery: cleanBatteryValue }].slice(-30);

    return { 
      ...state, 
      ...newData,
      batteryLevel: currentBattery, // Ensure state matches the validated value
      history: newHistory 
    };
  }),

  // UI Actions
  addLog: (msg) => set((state) => ({ logs: [msg, ...state.logs].slice(0, 20) })),
  triggerWeatherEvent: (weather) => set({ weather }),
  togglePause: () => set((state) => ({ 
    settings: { ...state.settings, isPaused: !state.settings.isPaused } 
  })),
  repairGrid: () => set((state) => ({
    isBlackout: false,
    transformers: state.transformers.map(t => ({ 
      ...t, status: 'ONLINE', temp: 35, load: 0, eff: 1 
    }))
  }))
}));

export default useStore;