const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create connection to MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'profile'
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + connection.threadId);
});

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Serve static files (like HTML, CSS, JS) from the 'public' directory
app.use(express.static('public'));

// Define route to handle form submission
app.post('/submit-form', (req, res) => {
  const { name, email, phone, idea } = req.body;

  // Insert form data into MySQL database
  const sql = 'INSERT INTO form_data (name, email, phone, idea) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, email, phone, idea], (err, result) => {
    if (err) {
      console.error('Error inserting form data into MySQL database: ' + err.message);
      res.status(500).send('Error submitting form');
      return;
    }
    console.log('Form data inserted into MySQL database with ID: ' + result.insertId);
    res.status(200).send('Form submitted successfully!');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
