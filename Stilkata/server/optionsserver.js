const express = require('express');
const cors = require('cors'); // To handle cross-origin requests
const mysql = require('mysql2'); // Use mysql2 for better MySQL support

const app = express();
const port = 3500; // Port set to 3500 as requested

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// Database configuration
const db = mysql.createConnection({
  host: 'wd.etsisi.upm.es',
  user: 'class',
  password: 'Class24_25',
  database: 'marsbd',
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit the server if the database connection fails
  }
  console.log('Connected to the database.');
});

// Route to get preferences for a specific user
app.get('/preferences/:username', (req, res) => {
  const username = req.params.username;
  const query = 'SELECT ufos, time FROM prefView WHERE user = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]); // Return the ufos and time preferences
  });
});

// Route to update preferences for a user
app.post('/preferences', (req, res) => {
  const { username, ufos, time } = req.body;

  if (!username || ufos === undefined || time === undefined) {
    return res.status(400).json({ error: 'Missing required fields: username, ufos, or time' });
  }

  const query = 'UPDATE prefView SET ufos = ?, time = ? WHERE user = ?';

  db.query(query, [ufos, time, username], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    res.json({ message: 'Preferences updated successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
