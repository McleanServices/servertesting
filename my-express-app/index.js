const express = require('express');
const https = require('https'); // Import the https module
const fs = require('fs'); // Import the fs module to read files
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser'); // Import body-parser
const jwt = require('jsonwebtoken'); // Make sure to import jwt if using it

const app = express();
const port = 3000; // Default HTTPS port

// Load your SSL certificate and key
const options = {
  key: fs.readFileSync('/root/my_ssl_certificates/mykey.pem'), // Path to your private key
  cert: fs.readFileSync('/root/my_ssl_certificates/mycert.pem'), // Path to your certificate
};


// Use CORS middleware to allow requests from all origins (for testing purposes)
app.use(cors({
  origin: '*',
}));

app.use(bodyParser.json());

const SECRET_KEY = "0192837465123456789";

// Ensure the API responds with JSON
app.get('/api/test', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({ message: 'Hello from the Express API!', timestamp: new Date() });
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

// Login API endpoint
app.post('/user/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  pool.query(query, [username], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = result[0];

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, userId: user.id });
  });
});

app.get('/user/account', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const query = 'SELECT id, username FROM users WHERE id = ?';
        pool.query(query, [decoded.id], (err, result) => {
            if (err) {
                console.error('Database query error:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(result[0]);
        });
    });
});

// Start the HTTPS server
https.createServer(options, app).listen(port, '0.0.0.0', () => {
  console.log(`Server running at https://0.0.0.0:${port}`);
});


// Connect to the database pool (optional, for logging)
pool.getConnection((err) => {
  if (err) {
    console.error('Error connecting to the database pool:', err);
  } else {
    console.log('Connected to the database pool.');
  }
});