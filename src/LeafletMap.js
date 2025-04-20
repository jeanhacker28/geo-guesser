import React, { useEffect } from "react";
import L from "leaflet";

const LeafletMap = ({ location, onMapClick }) => {
    useEffect(() => {
        const map = L.map("map", {
            center: [location.lat, location.lon],
            zoom: 5,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        map.on("click", (e) => {
            const { lat, lng } = e.latlng;
            onMapClick(lat, lng);
        });

        // Set marker at the real location
        L.marker([location.lat, location.lon]).addTo(map).bindPopup("Real location").openPopup();

        return () => map.remove();
    }, [location, onMapClick]);

    return <div id="map" style={{ height: "400px", marginTop: "20px" }}></div>;
};

export default LeafletMap;
