const HEADERS = ["Location", "Magnitude", "Time", "Depth (km)"];

/**
 * Converts the raw USGS GeoJSON into a 2D array ready for Excel's range.values.
 * Row 0 is the header row; every following row is one earthquake.
 * Newest earthquakes come first.
 *
 * @param {Object} geojson - Raw response from the USGS API.
 * @returns {Array<Array<string|number>>}
 */
export function formatEarthquakeData(geojson) {
  const features = geojson && Array.isArray(geojson.features) ? geojson.features : [];

  const rows = features
    .slice()
    .sort((a, b) => (b.properties?.time ?? 0) - (a.properties?.time ?? 0))
    .map((feature) => {
      const props = feature.properties || {};
      const coords = feature.geometry?.coordinates || [];

      const location = props.place || "Unknown location";

      // Keep magnitude numeric so Excel can sort/filter/chart it
      const magnitude = typeof props.mag === "number" ? props.mag : "N/A";

      const time = props.time ? new Date(props.time).toLocaleString() : "Unknown";

      // GeoJSON coordinates are [longitude, latitude, depth]
      const depth = typeof coords[2] === "number" ? coords[2] : "N/A";

      return [location, magnitude, time, depth];
    });

  // Always return a rectangular array with a header, even if there are no earthquakes
  return [HEADERS, ...rows];
}
