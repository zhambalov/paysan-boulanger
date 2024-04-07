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
  const { productId, quantity } = req.body;
  const userId = req.user_id; // Assuming you have the user ID available after authentication
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const sql = `
      INSERT INTO bakery_cart_items (cart_id, product_id, quantity)
      SELECT cart_id, :productId, :quantity
      FROM bakery_cart
      WHERE user_id = :userId
    `;
    const bindVars = {
      productId: productId,
      quantity: quantity,
      userId: userId
    };
    await connection.execute(sql, bindVars, { autoCommit: true });
    res.json({ success: true, message: 'Item added to cart successfully' });
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

app.get('/api/cart', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM bakery_cart_items`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching items from cart');
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
