const express = require('express');
const path = require('path');
const oracledb = require('oracledb');
const app = express();

// Define the port to run the server on
const PORT = process.env.PORT || 80;

// Oracle DB connection parameters
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING // Your connection string
};

oracledb.autoCommit = true; // Set this to auto commit if that is your desired behavior

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '..')));
app.use(express.static(path.join(__dirname, '../css')));
app.use(express.static(path.join(__dirname, '../images')));

// Route for serving the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Route for serving the cakes page
app.get('/cakes', (req, res) => {
  res.sendFile(path.join(__dirname, '../cakes.html'));
});

// Route for serving the breads page
app.get('/breads', (req, res) => {
  res.sendFile(path.join(__dirname, '../breads.html'));
});

// Check Database Connection

app.get('/test-db-connection', async (req, res) => {
    let connection;
    try {
      connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECT_STRING
      });
  
      // If the connection is successful, send a success message
      res.send('Connected to DB successfully!');
    } catch (err) {
      // If there's an error, send details of the error
      res.status(500).send(`DB connection failed: ${err.message}`);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
        } catch (err) {
          console.error('Error closing connection', err);
        }
      }
    }
  });
  

// Example API endpoint for getting products from the database
app.get('/api/products', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM products`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching products');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// The server starts listening on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
