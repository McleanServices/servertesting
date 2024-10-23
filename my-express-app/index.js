const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

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

// Create a connection pool to your Hostinger database
const pool = mysql.createPool({
  host: 'srv1267.hstgr.io', // E.g., 'localhost' or a remote host
  user: 'u175541833_expotest',
  password: 'oFnEl;P2',
  database: 'u175541833_expotest',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create an API route to fetch a user
app.get('/api/user', (req, res) => {
  pool.query('SELECT * FROM users LIMIT 1', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Error fetching user');
    } else {
      res.json(results[0]);  // Return the first user
    }
  });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});

// Connect to the database pool (optional, for logging)
pool.getConnection((err) => {
  if (err) {
    console.error('Error connecting to the database pool:', err);
  } else {
    console.log('Connected to the database pool.');
  }
});
