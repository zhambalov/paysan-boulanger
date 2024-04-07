const express = require('express');
const path = require('path');
const oracledb = require('oracledb');
const app = express();

// Define the port to run the server on
const PORT = process.env.PORT || 3000;

// Oracle DB connection parameters
const dbConfig = {
  user: 'COMP214_W24_zo_7', 
  password: 'Zhambalov123!', 
  connectString: '199.212.26.208:1521/SQLD'
};
oracledb.autoCommit = true;

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
    connection = await oracledb.getConnection(dbConfig);
    res.send('Connected to DB successfully!');
  } catch (err) {
    res.status(500).send(`DB connection failed: ${err.message}`);
  } finally {
    if (connection) {
      try {
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
    const result = await connection.execute(`SELECT * FROM bakery_products`);
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

// Add Item to Cart
app.post('/api/cart/add', async (req, res) => {
  const { cartId, productId, quantity } = req.body;
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    // Note: Adjust SQL syntax for Oracle. Example assumes 'MERGE INTO' or handling logic in PL/SQL block.
    const sql = `BEGIN
                   -- Procedure or PL/SQL block to add/update cart item
                 END;`;
    const result = await connection.execute(sql, { cartId, productId, quantity }, { autoCommit: true });
    res.json({ success: true, message: 'Item added to cart', data: result });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding item to cart');
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection', err);
      }
    }
  }
});

// Additional cart functionality endpoints would go here...

// The server starts listening on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
