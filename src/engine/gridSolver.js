/**
 * Highly optimized grid physics solver.
 * Calculates thermal dynamics, efficiency drops, and failure cascading.
 */
export const calculateGridTick = (nodes, environment) => {
  let totalEfficiency = 0;
  let activeNodes = 0;

  const updatedNodes = nodes.map(node => {
    // 1. Skip logic for dead nodes to save CPU cycles
    if (node.status === 'FAILED') return node;

    const loadRatio = node.load / node.cap;
    let newTemp = node.temp;
    let newStatus = node.status;
    let newCooling = node.cooling;

    // 2. Weather Penalties
    const heatMultiplier = environment.weather === 'HEATWAVE' ? 1.5 : 1.0;
    const coolingPenalty = environment.weather === 'STORM' ? 0.8 : 1.0;

    // 3. Thermal Dynamics Simulation
    // If load > 80%, temp increases. If cooling is damaged, it overheats faster.
    if (loadRatio > 0.8) {
      newTemp += (loadRatio * 2 * heatMultiplier) / (newCooling / 100);
    } else {
      // Natural cooling
      newTemp -= (1.5 * coolingPenalty); 
    }

    // Clamp temperature to ambient
    newTemp = Math.max(environment.ambientTemp, newTemp);

    // 4. Status Evaluation (Cascading Failures)
    if (newTemp > 110 || loadRatio > 1.2) {
      newStatus = 'FAILED';
      newTemp = 0; // Dead nodes cool instantly in this sim
    } else if (newTemp > 85 || loadRatio > 0.95) {
      newStatus = 'DEGRADED';
      newCooling = Math.max(10, newCooling - 0.5); // Damage cooling system
    }

    // 5. Calculate localized efficiency
    const eff = newStatus === 'FAILED' ? 0 : Math.max(0.1, 1 - (newTemp / 200));
    
    totalEfficiency += eff;
    activeNodes++;

    return {
      ...node,
      temp: newTemp,
      status: newStatus,
      cooling: newCooling,
      eff: eff
    };
  });

  return {
    updatedNodes,
    globalEfficiency: activeNodes === 0 ? 0 : totalEfficiency / activeNodes,
    isBlackout: activeNodes === 0 || (activeNodes / nodes.length < 0.3) // Blackout if 70% of grid dies
  };
};