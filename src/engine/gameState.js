import { create } from 'zustand';

const useStore = create((set, get) => ({
  // --- Data ---
  time: 0,
  batteryLevel: 50,
  demand: 300,
  sunIntensity: 0.5,
  windSpeed: 10,
  isBlackout: false,
  activeEvent: null,
  history: [],
  settings: { speed: 1, isPaused: false, solarCapacity: 100, windCapacity: 100, gridEfficiency: 1.0 },

  // --- Actions ---
  updateState: (newData) => set((state) => {
    const newHistory = [...state.history, { time: state.time, battery: state.batteryLevel }].slice(-50);
    return { ...state, ...newData, history: newHistory };
  }),

  upgradeInfrastructure: (type) => set((state) => ({
    settings: { ...state.settings, [type]: state.settings[type] * 1.2, gridEfficiency: state.settings.gridEfficiency * 0.98 }
  })),

  saveGame: () => localStorage.setItem('grid-save', JSON.stringify(get())),
  loadGame: () => {
    const saved = localStorage.getItem('grid-save');
    if (saved) set(JSON.parse(saved));
  },

  togglePause: () => set((state) => ({ settings: { ...state.settings, isPaused: !state.settings.isPaused } })),
  resetSimulation: () => set({ time: 0, batteryLevel: 50, isBlackout: false, history: [], activeEvent: null })
}));

export default useStore;