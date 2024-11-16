import 'dotenv/config'; // Automatically loads environment variables from .env
import express from 'express'; // Import express for creating the server
import fetch from 'node-fetch'; // Import node-fetch for making API requests

const app = express(); // Create an Express app
const PORT = 3000; // Port to run the server

// Serve static files from the "public" folder
app.use(express.static('public'));

// API route to fetch geocode data
app.get('/api/geocode', async (req, res) => {
  const city = req.query.city; // Get the city from query parameters
  const geocodeApiKey = process.env.GEOCODE_API_KEY; // Load API key from environment variables

  if (!city || !geocodeApiKey) {
    return res.status(400).send('Missing city or API key.');
  }

  // Construct the geocoding API URL
  const geocodeBaseUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${geocodeApiKey}`;

  try {
    const response = await fetch(geocodeBaseUrl); // Fetch data from the geocode API
    const data = await response.json(); // Parse the response JSON
    res.json(data); // Send the geocode data back to the client
  } catch (err) {
    console.error('Error fetching geocode data:', err);
    res.status(500).send('Error fetching geocode data.');
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
