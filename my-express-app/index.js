const express = require('express');
const cors = require('cors');
const app = express();
const port = 80;

// Use CORS middleware to allow requests from all origins (for testing purposes)
app.use(cors({
  origin: '*',
}));

// Ensure the API responds with JSON
app.get('/api/test', (req, res) => {
  res.setHeader('Content-Type', 'application/json'); // Ensure content type is JSON
  res.json({ message: 'Hello from the Express API!', timestamp: new Date() }); // Return JSON data
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`);
});
