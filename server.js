const WebSocket = require('ws');
const http = require('http');

// 1. Create a stable HTTP server anchor
const server = http.createServer();

// 2. Bind the WebSocket server to the HTTP anchor
const wss = new WebSocket.Server({ server });

console.log("==========================================");
console.log("⚡ SCADA HARDWARE SIMULATOR ONLINE ⚡");
console.log("📡 PORT: DYNAMIC // BIDIRECTIONAL MODE ACTIVE");
console.log("==========================================");

let globalBattery = 100.0;
let globalDemand = 800.0;

let persistentNodes = Array.from({ length: 15 }, (_, i) => {
  const isGen = i < 5;
  return {
    id: `TX-${isGen ? 'G' : 'T'}${i + 1}`,
    cap: isGen ? 500 : 250,
    load: isGen ? 300 : 150,
    temp: 65,
    cooling: 95,
    eff: 0.98,
    voltage: isGen ? "345kV" : "115kV",
    role: isGen ? "Generator" : "Step-Down Substation",
    sector: isGen ? "Sector 1: Generation Core" : "Sector 2: Heavy Transmission",
    status: 'ONLINE'
  };
});

const drift = (value, min, max, maxChange) => {
  const change = (Math.random() - 0.5) * 2 * maxChange;
  return Math.min(max, Math.max(min, value + change));
};

// 3. Robust Connection Handler
wss.on('connection', (ws) => {
  console.log("🟢 UI UPLINK ESTABLISHED. Command Channel Ready.");

  ws.on('message', (message) => {
    try {
      const command = JSON.parse(message);
      console.log(`📥 COMMAND RECEIVED: ${command.type} on ${command.nodeId}`);

      const target = persistentNodes.find(n => n.id === command.nodeId);
      if (!target) return;

      switch (command.type) {
        case 'REBOOT':
          target.status = 'ONLINE';
          target.temp = 40;
          target.cooling = 100;
          break;
        case 'FORCE_COOL':
          target.cooling = Math.min(100, target.cooling + 20);
          break;
        case 'SHUTDOWN':
          target.status = 'FAILED';
          break;
      }
    } catch (e) {
      console.error("Malformed command received:", e);
    }
  });

  const telemetryLoop = setInterval(() => {
    // A. Update global stats
    globalDemand = drift(globalDemand, 600, 1200, 15);
    globalBattery = drift(globalBattery, 0, 100, 0.5);
    
    // B. Physics/Weather Calculation
    const isExtremeWeather = Math.random() > 0.95;
    const currentWeather = isExtremeWeather ? (Math.random() > 0.5 ? 'STORM' : 'HEATWAVE') : 'CLEAR';

    persistentNodes = persistentNodes.map(node => {
      if (node.status === 'FAILED') return node;

      node.load = drift(node.load, node.cap * 0.2, node.cap * 1.1, 8);
      const loadRatio = node.load / node.cap;
      node.temp = drift(node.temp + (loadRatio > 0.8 ? 2.5 : -1.0), 40, 120, 1.5);
      node.cooling = drift(node.cooling, 40, 100, 2);
      
      if (node.temp > 105 || loadRatio > 1.05) {
        node.status = 'FAILED';
        node.load = 0;
      } else if (node.temp > 85 || loadRatio > 0.9) {
        node.status = 'DEGRADED';
      } else {
        node.status = 'ONLINE';
      }
      return node;
    });

    // C. Consolidated Data Packet
    const gridScore = Math.floor((globalBattery * 0.5) + (persistentNodes.filter(n => n.status === 'ONLINE').length * 10));
    
    // Debugging verification
    console.log(`DEBUG: Sending gridScore: ${gridScore}`);

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        nodes: persistentNodes,
        battery: globalBattery,
        weather: currentWeather,
        demand: globalDemand,
        gridScore: gridScore
      }));
    }
  }, 1000);

  ws.on('close', () => clearInterval(telemetryLoop));
  ws.on('error', (err) => console.error("Socket error:", err));
});

// 4. Bind the server to the environment port or 8080 locally
const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`--- HTTP GATEWAY ANCHORED ON PORT ${PORT} ---`);
});