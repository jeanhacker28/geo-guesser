import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LeafletMap = ({ location, onMapClick }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    const map = L.map(mapRef.current).setView([0, 0], 2); // Start with a world view

    // Add a tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Marker for the correct location
    const marker = L.marker([location.lat, location.lon]).addTo(map);

    // Handle map click
    map.on('click', (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      map.remove(); // Clean up the map when component unmounts
    };
  }, [location, onMapClick]);

  return <div ref={mapRef} className="leaflet-map" style={{ height: '400px', width: '600px' }} />;
};

export default LeafletMap;
