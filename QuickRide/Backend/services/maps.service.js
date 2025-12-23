const axios = require('axios');
const captainModel = require('../models/captain.model');


async function getAddressCoordinate(address, options = {}) {
  if (!address || typeof address !== 'string' || !address.trim()) {
    throw new Error('address is required and must be a non-empty string');
  }

  const apiKey = process.env.OLA_MAPS_API_KEY;
  if (!apiKey) throw new Error('Missing OLA_MAPS_API_KEY in environment variables');

  const language = options.language || 'English';

  const url = `https://api.olamaps.io/places/v1/geocode?address=${encodeURIComponent(address)}&language=${encodeURIComponent(language)}&api_key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    if (!data || (data.status !== 'ok' && data.status !== 'zero_results')) {
      throw new Error(`Unexpected Ola Maps geocode status: ${data && data.status}`);
    }

    if (data.status === 'zero_results' || !Array.isArray(data.geocodingResults) || data.geocodingResults.length === 0) {
      return null;
    }

    const first = data.geocodingResults[0];
    const loc = first && first.geometry && first.geometry.location;
    if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') {
      throw new Error('API response missing geometry.location (lat/lng)');
    }

    return {
      lat: loc.lat,
      lng: loc.lng,
      formatted_address: first.formatted_address || null,
      place_id: first.place_id || null,
      viewport: first.geometry && first.geometry.viewport ? first.geometry.viewport : null,
    };
  } catch (err) {
    if (err.response) {
      const { status, data } = err.response;
      throw new Error(`Ola Maps Geocode API error: HTTP ${status} - ${JSON.stringify(data)}`);
    }
    if (err.request) {
      throw new Error(`No response from Ola Maps Geocode API: ${err.message}`);
    }
    throw err;
  }
}

function sanitizeAddress(address) {
  // Remove excess commas and gate details that confuse the API
  return address
    .replace(/Gate No\s*\d+/gi, '') // remove gate numbers
    .replace(/\s+/g, ' ')           // normalize spaces
    .trim();
}

async function withRetries(fn, retries = 4, delay = 500) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn(); // Try the function
    } catch (err) {
      lastError = err;
      console.warn(`Attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        // wait before next retry
        await new Promise((res) => setTimeout(res, delay));
      }
    }
  }
  throw lastError; // Throw the last error after all retries fail

}




async function getDistanceTime(origin, destination, options = {}) {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  const apiKey = process.env.OLA_MAPS_API_KEY;
  if (!apiKey) throw new Error('Missing OLA_MAPS_API_KEY in environment variables');

  const mode = options.mode || 'driving';

  const isCoordinate = (s) => {
    if (typeof s !== 'string') return false;
    return /^\s*[-+]?\d+(\.\d+)?\s*,\s*[-+]?\d+(\.\d+)?\s*$/.test(s.trim());
  };

  const normalizeToArray = (v) => Array.isArray(v) ? v : [v];

  const originsArr = normalizeToArray(origin);
  const destinationsArr = normalizeToArray(destination);

  // convert each entry to "lat,lng" string; geocode place names
const convertToCoords = async (items, role) => {
  return Promise.all(items.map(async (item, idx) => {
    if (isCoordinate(item)) {
      return item.trim();
    }

    // Wrap geocoding in retry logic
    const geo = await withRetries(async () => {
        const cleanAddr = sanitizeAddress(item);
      const result = await getAddressCoordinate(cleanAddr);
      if (!result) {
        throw new Error(`Geocoding returned zero results for ${role}[${idx}] = "${item}"`);
      }
      return result;
    }, 4, 1000); // 4 retries, 1 second delay

    return `${geo.lat},${geo.lng}`;
  }));
};

  try {
    const [origCoords, destCoords] = await Promise.all([
      convertToCoords(originsArr, 'origin'),
      convertToCoords(destinationsArr, 'destination'),
    ]);

    // Build pipe-separated query params
    const originsParam = origCoords.join('|');       // e.g. "lat1,lng1|lat2,lng2"
    const destinationsParam = destCoords.join('|');

    const url = `https://api.olamaps.io/routing/v1/distanceMatrix?origins=${encodeURIComponent(originsParam)}&destinations=${encodeURIComponent(destinationsParam)}&mode=${encodeURIComponent(mode)}&api_key=${encodeURIComponent(apiKey)}`;

    const response = await axios.get(url)
    const data = response.data;

    if (!data || (data.status !== 'SUCCESS')) {
      throw new Error(`Unexpected Ola Maps geocode status: ${data && data.status}`);
    }
 // Basic validation of expected shape
    if (!data || !Array.isArray(data.rows)) {
      throw new Error(`Unexpected Ola DistanceMatrix response shape: ${JSON.stringify(data)}`);
    }

    return {
        distance:data.rows[0].elements[0].distance,
        duration:data.rows[0].elements[0].duration,
        polyline:data.rows[0].elements[0].polyline
    }

  } catch (err) {
    // normalize axios errors
    if (err.response) {
      const { status, data } = err.response;
      throw new Error(`Ola DistanceMatrix API error: HTTP ${status} - ${JSON.stringify(data)}`);
    }
    if (err.request) {
      throw new Error(`No response from Ola DistanceMatrix API: ${err.message}`);
    }
    throw err;
  }
}


async function getAutoCompleteSuggestions (input)  {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.OLA_MAPS_API_KEY;
    const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(input)}&api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'ok') {
            return response.data.predictions.map(prediction => prediction.description).filter(value => value); // Similar to Google
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async  function getCaptainsInTheRadius (lat, lng, radius) {
    // No changes needed; this is independent of the maps API
    // radius in km
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lat, lng], radius / 6371]
            }
        }
    });
    return captains;
}


module.exports = {
  getAddressCoordinate,
  getDistanceTime,
  getCaptainsInTheRadius,
  getAutoCompleteSuggestions
};
