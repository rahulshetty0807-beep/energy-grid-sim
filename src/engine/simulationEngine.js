import useStore from './gameState';

let requestRef;
let lastTimestamp = 0;

export const startSimulation = () => {
  lastTimestamp = 0; // Reset timestamp to ensure clean starts

  const animate = (timestamp) => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    
    // Clamp delta to 0.1s to prevent physics explosions if tab is inactive
    const deltaTime = Math.min((timestamp - lastTimestamp) / 1000, 0.1); 
    lastTimestamp = timestamp;

    const state = useStore.getState();

    if (!state.settings.isPaused && !state.isBlackout) {
      const timeStep = deltaTime * (state.settings.speed || 1);
      const currentTime = typeof state.time === 'number' ? state.time : 0;
      const nextTime = (currentTime + (timeStep * 0.5)) % 24;

      let ambientTemp = 25, solarMult = 1, windMult = 1, demandMult = 1;
      if (state.weather === 'STORM') { solarMult = 0.1; windMult = 2.5; ambientTemp = 15; } 
      else if (state.weather === 'HEATWAVE') { solarMult = 1.2; windMult = 0.3; demandMult = 1.4; ambientTemp = 45; }

      const sunIntensity = Math.max(0, Math.sin((nextTime / 24) * Math.PI * 2 - Math.PI / 2)) * solarMult;
      const windSpeed = Math.max(0, 0.5 + Math.sin(nextTime) * 0.5 + (Math.random() * 0.2)) * windMult;
      
      // Use defaults to prevent NaN
      const solarCap = state.settings?.solarCapacity ?? 250;
      const windCap = state.settings?.windCapacity ?? 200;
      const solarGen = solarCap * sunIntensity;
      const windGen = windCap * windSpeed;
      const currentDemand = 500 * demandMult;

      let totalEfficiency = 0;
      let activeNodes = 0;
      let logsToPush = []; 

      const updatedTransformers = state.transformers.map(tx => {
        let load = 0;
        
        // Sector Load Distribution
        if (tx.sector.includes('Sector 1')) load = tx.id.includes('Solar') ? solarGen / 2 : windGen;
        else if (tx.sector.includes('Sector 2')) load = (solarGen + windGen) / 3; 
        else if (tx.sector.includes('Sector 3')) load = currentDemand * 0.5 / 3;
        else if (tx.sector.includes('Sector 4')) load = currentDemand * 0.3 / 3;
        else if (tx.sector.includes('Sector 5')) load = currentDemand * 0.2 / 3;

        load += (Math.random() * 10 - 5);
        load = Math.max(0, load);

        const loadRatio = load / (tx.cap || 1);
        let newCooling = tx.cooling;
        let newTemp = ambientTemp + (Math.pow(loadRatio, 1.6) * 70);
        
        if (newTemp > 85) newCooling = Math.max(0, newCooling - (deltaTime * 2));
        if (newCooling < 50) newTemp += 20;

        let newEff = tx.eff;
        let newStatus = 'ONLINE';

        if (newTemp > 95 && Math.random() < 0.02) newEff -= 0.05; 
        if (newEff < 0.8) newStatus = 'DEGRADED';
        if (newTemp > 130 || newEff < 0.3) {
          newEff = 0;
          newStatus = 'FAILED';
          if (tx.status !== 'FAILED') logsToPush.push(`CRITICAL: ${tx.id} (${tx.role}) Core Meltdown!`);
        }

        if (newStatus !== 'FAILED') {
          totalEfficiency += newEff;
          activeNodes++;
        }

        return { 
          ...tx, 
          load: isNaN(load) ? 0 : load, 
          temp: isNaN(newTemp) ? 35 : newTemp, 
          eff: Math.max(0, newEff), 
          status: newStatus, 
          cooling: newCooling 
        };
      });

      const avgEfficiency = activeNodes > 0 ? (totalEfficiency / 15) : 0;
      const netPower = ((solarGen + windGen) * avgEfficiency) - currentDemand;
      const batteryDelta = (netPower / 60) * timeStep;
      let nextBattery = Math.min(100, Math.max(0, state.batteryLevel + batteryDelta));

      if (Math.random() < 0.0002) {
        const weathers = ['CLEAR', 'STORM', 'HEATWAVE'];
        state.triggerWeatherEvent(weathers[Math.floor(Math.random() * weathers.length)]);
      }

      // Batch all updates into a single call to prevent render loops
      state.updateState({
        time: nextTime,
        batteryLevel: nextBattery,
        isBlackout: nextBattery <= 0 || avgEfficiency < 0.2,
        gridEfficiency: avgEfficiency,
        demand: currentDemand,
        transformers: updatedTransformers,
        logs: [...logsToPush.map(log => `[${nextTime.toFixed(1)}h] ${log}`), ...state.logs].slice(0, 20)
      });
    }
    
    requestRef = requestAnimationFrame(animate);
  };
  
  requestRef = requestAnimationFrame(animate);
};

export const stopSimulation = () => {
  cancelAnimationFrame(requestRef);
  lastTimestamp = 0;
};