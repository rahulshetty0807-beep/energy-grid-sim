import useStore from './gameState';

let requestRef;
let lastTimestamp = 0;

export const startSimulation = () => {
  const animate = (timestamp) => {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    const state = useStore.getState();

    if (!state.settings.isPaused) {
      // 1. Time & Weather Logic
      const timeStep = deltaTime * state.settings.speed;
      const nextTime = (state.time + (timeStep * 0.1)) % 24;
      const nextSun = Math.max(0, Math.sin((nextTime / 24) * Math.PI * 2 - Math.PI / 2));
      const nextWind = Math.max(0, 5 + Math.sin(nextTime) * 15 + (Math.random() * 5));

      // 2. Physics Engine
      const gen = (state.settings.solarCapacity * nextSun) + (state.settings.windCapacity * (nextWind / 20));
      const demandMult = state.activeEvent ? state.activeEvent.demandMultiplier : 1;
      const netPower = (gen * state.settings.gridEfficiency) - (state.demand * demandMult);
      
      const batteryDelta = (netPower / 60) * timeStep;
      let nextBattery = Math.min(100, Math.max(0, state.batteryLevel + batteryDelta));

      // 3. Chaos Events
      if (Math.random() < 0.0005 && !state.activeEvent) {
        const events = [{ name: "Heatwave", demandMultiplier: 2.5 }, { name: "Storm", demandMultiplier: 1.0 }];
        state.updateState({ activeEvent: events[Math.floor(Math.random() * events.length)] });
        setTimeout(() => useStore.getState().updateState({ activeEvent: null }), 15000);
      }

      // 4. Commit
      state.updateState({ time: nextTime, sunIntensity: nextSun, windSpeed: nextWind, batteryLevel: nextBattery, isBlackout: nextBattery <= 0 });
    }
    requestRef = requestAnimationFrame(animate);
  };
  requestRef = requestAnimationFrame(animate);
};

export const stopSimulation = () => cancelAnimationFrame(requestRef);