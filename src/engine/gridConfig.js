// This acts as your JSON schema. You can easily swap this out with a fetch() call to a real database.
export const INITIAL_GRID_STATE = {
  gridId: "OMEGA-SECTOR-7",
  environment: {
    weather: "CLEAR", // CLEAR, STORM, HEATWAVE
    ambientTemp: 25,
  },
  globalStats: {
    batteryLevel: 100,
    gridEfficiency: 1.0,
  },
  nodes: [
    // L1: GENERATION (The sources)
    { id: "TX-GEN-1", type: "STEP-UP", sector: "Sector 1: Generation Core", cap: 500, load: 450, temp: 45, cooling: 100, status: "ONLINE", connections: ["TX-SUB-A", "TX-SUB-B"] },
    { id: "TX-GEN-2", type: "STEP-UP", sector: "Sector 1: Generation Core", cap: 500, load: 300, temp: 42, cooling: 100, status: "ONLINE", connections: ["TX-SUB-B"] },
    
    // L2: TRANSMISSION (The routing hubs)
    { id: "TX-SUB-A", type: "TRANSMISSION", sector: "Sector 2: Heavy Transmission", cap: 400, load: 200, temp: 38, cooling: 100, status: "ONLINE", connections: ["TX-DIST-1", "TX-DIST-2"] },
    { id: "TX-SUB-B", type: "TRANSMISSION", sector: "Sector 2: Heavy Transmission", cap: 400, load: 380, temp: 55, cooling: 80, status: "ONLINE", connections: ["TX-DIST-3"] },

    // L3: DISTRIBUTION (The endpoints)
    { id: "TX-DIST-1", type: "DISTRIBUTION", sector: "Sector 3: Industrial District", cap: 150, load: 140, temp: 65, cooling: 90, status: "ONLINE", connections: [] },
    { id: "TX-DIST-2", type: "DISTRIBUTION", sector: "Sector 4: Commercial Hub", cap: 150, load: 90, temp: 40, cooling: 100, status: "ONLINE", connections: [] },
    { id: "TX-DIST-3", type: "DISTRIBUTION", sector: "Sector 5: Residential Grid", cap: 200, load: 195, temp: 85, cooling: 50, status: "DEGRADED", connections: [] },
  ]
};