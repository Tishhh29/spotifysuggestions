const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

// Set up Spotify API credentials
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Step 1: Get the user to log in with Spotify
router.get('/login', (req, res) => {
  const scopes = ['user-top-read', 'user-read-recently-played'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

// Step 2: Handle the callback from Spotify
router.get('/callback', (req, res) => {
  const code = req.query.code;
  spotifyApi.authorizationCodeGrant(code).then(data => {
    // Save the access token
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    res.redirect('/spotify/top-artists');
  }).catch(err => {
    console.error('Error getting tokens', err);
    res.send('Error during login');
  });
});

// Step 3: Get user's top artists
router.get('/top-artists', (req, res) => {
  spotifyApi.getMyTopArtists().then(data => {
    const artists = data.body.items.map(artist => ({
      name: artist.name,
      id: artist.id
    }));
    res.send(artists);  // For now, just send the artists data in JSON
  }).catch(err => {
    console.error('Error fetching top artists', err);
    res.send('Error fetching top artists');
  });
});

module.exports = router;

