import React, { useState, useEffect } from 'react';
import LeafletMap from './LeafletMap';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: 0, lon: 0 });
  const [distance, setDistance] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Dynamically import images from the public/images folder
  const imageContext = require.context('./public/images', false, /\.(jpg|jpeg|png|gif)$/);
  const imageFiles = imageContext.keys(); // Get the list of all image file paths

  // Fetch a random image from the public/images folder
  const fetchRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    const randomImagePath = imageFiles[randomIndex];
    const randomImage = imageContext(randomImagePath);

    setImage(randomImage); // Set the random image

    // For simplicity, assigning a random location for now.
    // Ideally, you would store the lat/lon of each image in an array or database.
    setLocation({
      lat: Math.random() * 180 - 90, // Random latitude between -90 and 90
      lon: Math.random() * 360 - 180 // Random longitude between -180 and 180
    });
  };

  // Calculate the distance between two points on the globe
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Handle user clicks on the map
  const handleMapClick = (lat, lon) => {
    if (location) {
      const dist = calculateDistance(lat, lon, location.lat, location.lon);
      setDistance(dist);
    }
  };

  // Reset the game with a new random image
  const nextLocation = () => {
    setDistance(null);
    fetchRandomImage();
  };

  // Start the game after showing instructions
  const startGame = () => {
    setShowInstructions(false);
    setGameStarted(true);
    fetchRandomImage(); // Start with a random image
  };

  return (
    <div className="App">
      <h1>GeoGuessr Lite</h1>

      {showInstructions && (
        <div className="instructions">
          <h2>How to Play:</h2>
          <p>
            You will be shown an image of a random location. Your task is to guess where it was taken by clicking on the world map. 
            The closer you are, the better your score!
          </p>
          <button onClick={startGame}>Start Game</button>
        </div>
      )}

      {gameStarted && (
        <div className="game-container">
          <div className="image-container">
            {image && <img src={image} alt="Random location" className="game-image" />}
          </div>

          <div className="map-container">
            <LeafletMap location={location} onMapClick={handleMapClick} />
          </div>

          {distance !== null && (
            <div className="distance-info">
              <h3>You are {distance.toFixed(2)} km away from the real location!</h3>
            </div>
          )}

          <button onClick={nextLocation}>Next Location</button>
        </div>
      )}
    </div>
  );
}

export default App;
