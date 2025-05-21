const express = require('express');
const path = require('path');
const app = express();

// Determine the build folder name (usually the project name)
const distFolder = 'Inbox-pilot';

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist', distFolder)));

// Send all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', distFolder, 'index.html'));
});

// Start the app by listening on the default Heroku/Render port
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});