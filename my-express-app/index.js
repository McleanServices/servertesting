const mysql = require('mysql2');

// Create connection to your Hostinger database
const connection = mysql.createConnection({
  host: 'localhost',  // E.g., 'localhost' or a remote host
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
      res.status(500).send('Error fetching user');
    } else {
      res.json(results[0]);  // Return the first user
    }
  });
});
