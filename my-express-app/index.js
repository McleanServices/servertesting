const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const port = 80;

// Use CORS middleware

app.use(cors({
  origin: '*', // Allow all origins (for testing purposes)
}));


// Simple GET endpoint
// app.get('/api/test', (req, res) => {
//   const response = { message: 'Hello from the Express API!', timestamp: new Date() };
//   console.log('Sending Response:', response);
//   res.json(response);
// });

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the Express API!', timestamp: new Date() });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`);
});
