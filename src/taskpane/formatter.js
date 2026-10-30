const HEADERS = [
  "Location", "Magnitude", "Mag Type", "Time",
  "Latitude", "Longitude", "Depth (km)",
  "Type", "Status", "Tsunami", "Significance", "Alert", "USGS Link",
];

export function formatEarthquakeData(geojson) {
  const features = geojson && Array.isArray(geojson.features) ? geojson.features : [];

  const num = (v) => (typeof v === "number" ? v : "N/A");

  const rows = features
    .slice()
    .sort((a, b) => (b.properties?.time ?? 0) - (a.properties?.time ?? 0))
    .map((f) => {
      const p = f.properties || {};
      const c = f.geometry?.coordinates || [];

      return [
        p.place || "Unknown location",
        num(p.mag),
        p.magType || "N/A",
        p.time ? new Date(p.time).toLocaleString() : "Unknown",
        num(c[1]),                       // latitude
        num(c[0]),                       // longitude
        num(c[2]),                       // depth
        p.type || "N/A",
        p.status || "N/A",
        p.tsunami === 1 ? "Yes" : "No",
        num(p.sig),
        p.alert || "None",
        p.url || "",
      ];
    });

  return [HEADERS, ...rows];
}
