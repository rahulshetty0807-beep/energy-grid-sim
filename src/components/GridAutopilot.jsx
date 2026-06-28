import { useEffect, useRef } from 'react';
import useStore from '../engine/gameState';

export default function GridAutopilot() {
  const { transformers, sendCommand, addLog } = useStore();
  const autopilotInterval = useRef(null);
  
  // Track last command time per node to prevent "Command Flooding"
  const lastAction = useRef({});

  useEffect(() => {
    autopilotInterval.current = setInterval(() => {
      transformers.forEach(node => {
        const now = Date.now();
        const lastCmd = lastAction.current[node.id] || 0;
        
        // 1. Rate Limiting: Only command a node once every 10 seconds
        if (now - lastCmd < 10000) return;

        // 2. Intelligence: Adaptive Interventions based on Risk Score
        if (node.risk > 90) {
          // EMERGENCY: Maximum Intervention
          sendCommand(node.id, 'SHUTDOWN_LOAD');
          addLog(`AUTOPILOT [CRITICAL]: Emergency load shedding on ${node.id}`, 'ERROR');
          lastAction.current[node.id] = now;
        } 
        else if (node.risk > 75) {
          // PREVENTATIVE: Aggressive Cooling
          sendCommand(node.id, 'FORCE_COOL');
          addLog(`AUTOPILOT [WARNING]: Initiating aggressive cooling on ${node.id}`, 'WARN');
          lastAction.current[node.id] = now;
        }
        else if (node.status === 'DEGRADED') {
          // MAINTENANCE: Load Balancing
          sendCommand(node.id, 'BALANCE_LOAD');
          addLog(`AUTOPILOT [INFO]: Load balancing active for ${node.id}`, 'INFO');
          lastAction.current[node.id] = now;
        }
      });
    }, 2000); // Scans more frequently, but rate-limited per node

    return () => clearInterval(autopilotInterval.current);
  }, [transformers, sendCommand, addLog]);

  return null; 
}