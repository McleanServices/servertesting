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
  res.setHeader('Content-Type', 'application/json'); // Set content type to JSON
  res.json({ message: 'Hello from the Express API!', timestamp: new Date() }); // Return a JSON response
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});

const mysql = require('mysql2');

// Create connection to your Hostinger database
const connection = mysql.createConnection({
  host: 'srv1267.hstgr.io',  // E.g., 'localhost' or a remote host
  user: 'u175541833_expotest',
  password: 'oFnEl;P2',
  database: 'u175541833_expotest'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Create an API route to fetch a user
app.get('/api/user', (req, res) => {
  connection.query('SELECT * FROM users LIMIT 1', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Error fetching user');
    } else {
      res.json(results[0]);  // Return the first user
    }
  });
});






