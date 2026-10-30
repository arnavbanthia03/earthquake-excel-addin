const USGS_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

/**
 * Fetches the past month's earthquakes from the USGS GeoJSON feed.
 * @returns {Promise<Object>} The raw GeoJSON response (FeatureCollection).
 * @throws {Error} With a user-friendly message on network, HTTP or parsing failure.
 */
export async function fetchEarthquakes() {
  let response;

  try {
    response = await fetch(USGS_URL);
  } catch (networkError) {
    throw new Error(
      "Network error: could not reach the USGS server. Check your internet connection and try again."
    );
  }

  if (!response.ok) {
    throw new Error(
      `USGS server returned an error (HTTP ${response.status}). Please try again later.`
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error("Received an invalid response from USGS (could not read JSON).");
  }

  if (!data || !Array.isArray(data.features)) {
    throw new Error("Unexpected data format received from USGS.");
  }

  return data;
}
