const express = require('express');
const path = require('path');
const spotifyRoutes = require('./routes/spotify');
const app = express();

// Load environment variables
require('dotenv').config();

console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);
console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET);
console.log('Redirect URI:', process.env.SPOTIFY_REDIRECT_URI);


// Set the port
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use the Spotify routes
app.use('/spotify', spotifyRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

