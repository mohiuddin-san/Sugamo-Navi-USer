import { useState, useEffect, useRef } from "react";

// Client-side only component for map
const MapComponent = () => {
  const [isClient, setIsClient] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState<{
    MapContainer: any;
    TileLayer: any;
    Marker: any;
    Polyline: any;
    Tooltip: any;
  } | null>(null);
  const mapRef = useRef<any>(null);
  const LRef = useRef<any>(null); // Store Leaflet instance

  useEffect(() => {
    const loadMapLibs = async () => {
      try {
        // Load Leaflet CSS first
        const leafletCss = document.createElement("link");
        leafletCss.rel = "stylesheet";
        leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(leafletCss);

        // Load Leaflet script
        const leafletScript = document.createElement("script");
        leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        leafletScript.async = true;
        document.body.appendChild(leafletScript);

        leafletScript.onload = async () => {
          if ((window as any).L) {
            LRef.current = (window as any).L; // Store Leaflet instance
            try {
              // Dynamically import react-leaflet
              const module = await import("react-leaflet");
              setLeafletComponents({
                MapContainer: module.MapContainer,
                TileLayer: module.TileLayer,
                Marker: module.Marker,
                Polyline: module.Polyline,
                Tooltip: module.Tooltip,
              });
              setIsClient(true);
            } catch (err) {
              console.error("Failed to load react-leaflet:", err);
            }
          }
        };

        leafletScript.onerror = () => {
          console.error("Failed to load Leaflet script");
        };
      } catch (err) {
        console.error("Error in loadMapLibs:", err);
      }
    };

    loadMapLibs();

    // Cleanup on unmount
    return () => {
      const scripts = document.querySelectorAll('script[src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"]');
      scripts.forEach((script) => script.remove());
      const css = document.querySelectorAll('link[href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]');
      css.forEach((link) => link.remove());
    };
  }, []);

  if (!isClient || !LeafletComponents || !LRef.current) return <div>Loading map...</div>;

  const { MapContainer, TileLayer, Marker, Polyline, Tooltip } = LeafletComponents;
  const L = LRef.current;

  const setMapRef = (map: any) => {
    if (map) mapRef.current = map;
  };

  // Fallback default icon in case custom icons fail
  const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Custom icons for start and end
  const startIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const endIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Fixed list of latitude, longitude, and names
  const locations = [
    { position: [35.6895, 139.6917], name: "Tokyo Station" }, // Start
    { position: [35.6988, 139.7725], name: "Akihabara" }, // Next
    { position: [35.7101, 139.8107], name: "Asakusa" }, // Next
    { position: [35.6762, 139.6503], name: "Shinjuku" }, // Next
    { position: [35.6581, 139.7017], name: "Shibuya" }, // End
  ];

  return (
    <MapContainer
      center={locations[0].position}
      zoom={12}
      style={{ height: "500px", width: "100%" }}
      ref={setMapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
      />
      {locations.map((loc, i) => {
        let icon = defaultIcon;
        let label = loc.name;

        if (i === 0) {
          icon = startIcon;
          label = `Start Point: ${loc.name}`;
        } else if (i === locations.length - 1) {
          icon = endIcon;
          label = `Finish Point: ${loc.name}`;
        }

        return (
          <Marker key={i} position={loc.position} icon={icon}>
            <Tooltip permanent direction="top" offset={[0, -40]}>{label}</Tooltip>
          </Marker>
        );
      })}
      <Polyline positions={locations.map((loc) => loc.position)} color="red" />
    </MapContainer>
  );
};

export default function MapPage() {
  return (
    <div>
      
      <MapComponent />
    </div>
  );
}