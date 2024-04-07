const express = require('express');
const path = require('path');
const app = express();

// Define the port to run the server on
const PORT = process.env.PORT || 80;

// Serve static files from the root, css, images, and js directories
// Since index.js is inside the js folder, we use '..' to go up to the project root
app.use(express.static(path.join(__dirname, '..')));  // Serves all static files from the root
app.use(express.static(path.join(__dirname, '../css')));
app.use(express.static(path.join(__dirname, '../images')));

// Route for serving the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Route for serving the cakes page
app.get('/cakes', (req, res) => {
  res.sendFile(path.join(__dirname, '../cakes.html'));
});

// Route for serving the breads page
app.get('/breads', (req, res) => {
  res.sendFile(path.join(__dirname, '../breads.html'));
});

// The server starts listening on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
