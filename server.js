const express = require('express');
const path = require('path');
const app = express();

// Get the exact build output directory name
const distFolder = 'inbox-pilot-frontend';

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist', distFolder)));

// Send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', distFolder, 'index.html'));
});

// Start the app by listening on the default Render port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving files from: ${path.join(__dirname, 'dist', distFolder)}`);
});