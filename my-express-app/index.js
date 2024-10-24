const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const cors = require('cors');



// Middleware
 // Enable CORS for all routes


const app = express();
const port = 80;

app.use(cors({
    origin: '*',
  }));

// Middleware
app.use(bodyParser.json());

const SECRET_KEY = "0192837465123456789";  // Make sure to keep this secure

app.use(express.json());

// MySQL connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'test'
// });

const db = mysql.createPool({
    host: 'srv1267.hstgr.io', // E.g., 'localhost' or a remote host
    user: 'u175541833_expotest',
    password: 'oFnEl;P2',
    database: 'u175541833_expotest',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Login API endpoint
// app.post('/user/login', (req, res) => {
//     const { username, password } = req.body;

//     const user = result[0];

//     if (!username || !password) {
//         return res.status(400).json({ message: 'Username and password are required' });
//     }

//     const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
//     db.query(query, [username, password], (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             return res.status(500).json({ message: 'Internal server error' });
//         }

//         if (results.length > 0) {
//             res.json({ message: 'Login successful' });
//         } else {
//             res.status(401).json({ message: 'Invalid username or password' });
//         }


//     });

//     const token = jwt.sign(
//         { id: user.id},
//         SECRET_KEY,
//         { expiresIn: '1h' }  // Token expires in 1 hour
//     );

//     // Return token and user data
//     res.json({
//         token,
//         user: { id: user.id }
//     });



// });

app.post("/register", (req, res) => {
    const {username,firstName, lastName, email, password, phoneNumber, dateOfBirth } = req.body;
      // Use email as the username

    // Validate input
    if (!username || !firstName || !lastName || !email || !password || !phoneNumber || !dateOfBirth) {
        return res.status(400).json({ message: "Please fill in all fields." });
    }

    const createdAt = new Date(); // Get the current date and time

    // Insert the new user into the database without hashing the password
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




app.post('/user/login', (req, res) => {
    const { username, password } = req.body;

    // Sample user lookup
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (result.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = result[0];

        // Directly compare stored password with provided password
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token and send response
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
        db.query(query, [decoded.id], (err, result) => {
            if (err) throw err;

            if (result.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(result[0]);
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});