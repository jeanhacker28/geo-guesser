import React, { useState, useEffect } from "react";
import LeafletMap from "./LeafletMap";
import './App.css';

const unsplashApiKey = 'YOUR_UNSPLASH_API_KEY'; // Replace with your API key

function App() {
    const [image, setImage] = useState(null);
    const [location, setLocation] = useState({ lat: 0, lon: 0 });
    const [distance, setDistance] = useState(null);

    const fetchRandomImage = async () => {
      try {
          const response = await fetch(`https://api.unsplash.com/photos/random?query=landscape&client_id=${unsplashApiKey}`);
          const data = await response.json();
          console.log(data); // Log the response for debugging
          
          if (data && data.length > 0) {
              const randomImage = data[0];
  
              // Check if the image and location data are valid
              if (randomImage.urls && randomImage.urls.regular) {
                  setImage(randomImage.urls.regular);
              } else {
                  console.error("Image URL is missing.");
              }
  
              if (randomImage.location && randomImage.location.lat && randomImage.location.lng) {
                  setLocation({ lat: randomImage.location.lat, lon: randomImage.location.lng });
              } else {
                  console.warn("Location data is missing.");
              }
          } else {
              console.error("No data returned from Unsplash API.");
          }
      } catch (error) {
          console.error("Error fetching image from Unsplash:", error);
      }
  };  

    // Calculate the distance between two coordinates
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    };

    // Handle user click on the map
    const handleMapClick = (lat, lon) => {
        const dist = calculateDistance(lat, lon, location.lat, location.lon);
        setDistance(dist);
    };

    // Next location button click
    const nextLocation = () => {
        setDistance(null);
        fetchRandomImage();
    };

    useEffect(() => {
        fetchRandomImage();
    }, []);

    return (
        <div className="App">
            <h1>GeoGuessr Lite</h1>
            <div id="image-container">
                {image && <img src={image} alt="Random location" />}
            </div>
            <LeafletMap location={location} onMapClick={handleMapClick} />
            {distance !== null && (
                <div id="result">
                    <h3>You are {distance.toFixed(2)} km away from the real location!</h3>
                </div>
            )}
            <button onClick={nextLocation}>Next Location</button>
        </div>
    );
}

export default App;
