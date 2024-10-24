const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Assuming you are using JWT for login

const app = express();
const port = 80;

app.use(cors({
    origin: '*',
}));

app.use(bodyParser.json());

const SECRET_KEY = "0192837465123456789";  // Make sure to keep this secure

// MySQL connection pool
const db = mysql.createPool({
    host: 'srv1267.hstgr.io', 
    user: 'u175541833_expotest',
    password: 'oFnEl;P2',
    database: 'u175541833_expotest',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// No need to use db.connect() when using connection pool

// Register API endpoint
app.post("/register", (req, res) => {
    const { username, firstName, lastName, email, password, phoneNumber, dateOfBirth } = req.body;

    if (!username || !firstName || !lastName || !email || !password || !phoneNumber || !dateOfBirth) {
        return res.status(400).json({ message: "Please fill in all fields." });
    }

    const createdAt = new Date();

    const query = `
        INSERT INTO users (username, password, email, created_at, first_name, last_name, phone_number, date_of_birth)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [username, password, email, createdAt, firstName, lastName, phoneNumber, dateOfBirth];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error("Error inserting user:", err);
            return res.status(500).json({ message: "Database error. Please try again." });
        }
        return res.status(201).json({ message: "User registered successfully!" });
    });
});

// Login API endpoint
app.post('/user/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
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

// Account details API (using JWT token)
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
        db.query(query, [decoded.id], (err, result) => {
            if (err) throw err;

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(result[0]);
        });
    });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});
