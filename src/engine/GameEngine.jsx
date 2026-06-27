import { useEffect, useRef } from 'react';
import useStore from './gameState';

export default function GameEngine() {
  const intervalRef = useRef(null);

  useEffect(() => {
    // 1. Start the simulation heartbeat
    intervalRef.current = setInterval(() => {
      // Always get the LATEST state from the store
      const state = useStore.getState();

      // 2. Logic Halt: Only proceed if system is running
      if (state.settings.isPaused || state.isBlackout) return;

      // 3. Logic Execution
      useStore.setState((state) => {
        // A. Dynamic Demand logic
        let currentDemand = 500 + (Math.random() * 40 - 20); 
        let tempMod = state.weather === 'HEATWAVE' ? 1.5 : 0;
        if (state.weather === 'HEATWAVE') currentDemand *= 1.3;
        if (state.weather === 'STORM') currentDemand *= 0.9;

        // B. Calculate capacity (Safeguard added: prevent division by zero)
        const activeTxs = state.transformers.filter(t => t.status !== 'FAILED' && t.status !== 'OFFLINE');
        const totalCapacity = activeTxs.reduce((sum, t) => sum + t.cap, 0);
        const safeTotalCap = totalCapacity > 0 ? totalCapacity : 1; 
        
        // C. Battery logic
        let newBattery = state.batteryLevel;
        let newBlackout = state.isBlackout;
        let newLogs = [...state.logs];

        if (totalCapacity < currentDemand) {
          newBattery = Math.max(0, newBattery - 2.5);
          if (newBattery === 0) {
            newBlackout = true;
            newLogs = [`[${state.time.toFixed(1)}h] CRITICAL: GRID COLLAPSE`, ...newLogs];
          }
        } else {
          newBattery = Math.min(100, newBattery + 0.5);
        }

        // D. Transformer Thermodynamics
        const updatedTransformers = state.transformers.map(tx => {
          if (tx.status === 'FAILED' || tx.status === 'OFFLINE') return tx;

          const load = (tx.cap / safeTotalCap) * currentDemand;
          const loadRatio = load / tx.cap;
          
          let currentTemp = tx.temp;
          if (loadRatio > 0.9) currentTemp += (1.2 + tempMod);
          else currentTemp = Math.max(30, currentTemp - 0.8);

          let status = 'ONLINE';
          if (currentTemp >= 95) {
            status = 'FAILED';
            newLogs = [`[${state.time.toFixed(1)}h] NODE FAILED: ${tx.id}`, ...newLogs];
          } else if (currentTemp >= 80) {
            status = 'DEGRADED';
          }

          return { ...tx, load, temp: currentTemp, status };
        });

        // E. Return the synchronized state
        return {
          time: state.time + 0.1,
          demand: currentDemand,
          batteryLevel: newBattery,
          isBlackout: newBlackout,
          transformers: updatedTransformers,
          logs: newLogs.slice(0, 15)
        };
      });
    }, 1000);

    // 4. Cleanup on unmount
    return () => clearInterval(intervalRef.current);
  }, []); // Empty array ensures we only ever start one single loop

  return null; 
}