// src/engine/geoUtils.js

// 1. Initialize an in-memory cache to prevent redundant API calls
const geoCache = new Map();

/**
 * Fetches real coordinates using open-source OpenStreetMap (Nominatim) data.
 * Includes timeout protection, caching, and custom User-Agent headers.
 */
export const fetchCoordinates = async (placeName, options = {}) => {
  const query = placeName?.trim();
  if (!query) {
    console.warn("[GeoUtils] Empty search query provided.");
    return null;
  }

  // Check Cache
  const cacheKey = query.toLowerCase();
  if (geoCache.has(cacheKey)) {
    return geoCache.get(cacheKey);
  }

  const timeoutMs = options.timeout || 5000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Request city/address details for precision
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`;

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        // REQUIRED by OSM Nominatim Usage Policy
        'User-Agent': 'OmegaGrid-Command-Interface/1.0 (admin@yourdomain.com)',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      
      const payload = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
        city: result.address?.city || result.address?.town || result.address?.village || "Unknown City",
        country: result.address?.country || "Unknown Country",
        countryCode: result.address?.country_code,
        boundingBox: result.boundingbox 
      };

      geoCache.set(cacheKey, payload);
      return payload;
    }

    console.warn(`[GeoUtils] No coordinates found for: "${query}"`);
    return null;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error(`[GeoUtils] Geocoding request timed out after ${timeoutMs}ms.`);
    } else {
      console.error("[GeoUtils] Geocoding service failed:", error.message);
    }
    return null;
  }
};

/**
 * Searches for REAL power infrastructure in a 25km radius.
 * If no real data exists, falls back to a simulated power grid.
 */
export const generateRegionalGrid = async (lat, lng, cityName, count = 10) => {
  const radius = 25000; // 25km radius
  
  // Overpass API Query: Finds all power plants, substations, and generators in the area
  const overpassQuery = `
    [out:json][timeout:10];
    (
      nwr["power"="plant"](around:${radius},${lat},${lng});
      nwr["power"="substation"](around:${radius},${lat},${lng});
      nwr["power"="generator"](around:${radius},${lat},${lng});
    );
    out center ${count};
  `;

  const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

  try {
    const response = await fetch(overpassUrl);
    const data = await response.json();
    
    const newNodes = [];
    const newLinks = [];

    if (data.elements && data.elements.length > 0) {
      data.elements.forEach((el, index) => {
        // Handle coordinates whether they are nodes (points) or ways/relations (polygons)
        const nodeLat = el.lat || el.center?.lat;
        const nodeLng = el.lon || el.center?.lon;
        
        if (!nodeLat || !nodeLng) return; 

        const isGen = el.tags?.power === 'plant' || el.tags?.power === 'generator';
        const nodeId = `TX-${el.id}`; 
        
        newNodes.push({
          id: nodeId,
          isDynamic: true, // Crucial: Flag used by gameState.js to prevent backend overwrite
          lat: nodeLat,
          lng: nodeLng,
          sector: cityName.toUpperCase(),
          type: isGen ? 'generator' : 'substation',
          capacity: isGen ? 800 : 250,
          role: isGen ? 'Gen Node' : 'Substation',
          load: isGen ? 400 : 150,
          temp: 45,
          cooling: 100,
          status: 'ONLINE',
          realName: el.tags?.name || 'Unregistered Asset' 
        });

        // Auto-link new substations to the first generated power plant to form a network
        if (index > 0 && newNodes.length > 0 && newNodes[0].type === 'generator') {
          newLinks.push({
            source: newNodes[0].id,
            target: nodeId,
            type: 'primary_grid'
          });
        }
      });
      
      console.log(`[GeoUtils] Successfully pulled ${newNodes.length} REAL power stations for ${cityName}`);
      return { newNodes, newLinks };
    }
    
    throw new Error("No real infrastructure mapped in this region.");

  } catch (error) {
    console.warn(`[GeoUtils] Falling back to simulated grid for ${cityName}.`, error.message);
    
    const newNodes = [];
    const newLinks = [];
    
    // Simulation fallback generator
    for (let i = 0; i < count; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.2;
      const offsetLng = (Math.random() - 0.5) * 0.2;
      const nodeId = `SIM-${cityName.toUpperCase()}-${i + 1}`;
      
      newNodes.push({
        id: nodeId,
        isDynamic: true,
        lat: lat + offsetLat,
        lng: lng + offsetLng,
        sector: cityName.toUpperCase(),
        type: i === 0 ? 'generator' : 'substation',
        capacity: 200 + Math.random() * 300,
        role: i === 0 ? 'Gen Node' : 'Substation',
        load: 100, temp: 40, cooling: 100, status: 'ONLINE',
        realName: 'SIMULATED INFRASTRUCTURE'
      });

      if (i > 0) newLinks.push({ source: `SIM-${cityName.toUpperCase()}-1`, target: nodeId });
    }
    return { newNodes, newLinks };
  }
};