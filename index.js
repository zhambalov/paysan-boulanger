const express = require('express');
const path = require('path');
const oracledb = require('oracledb');
const app = express();

const PORT = process.env.PORT || 3000;

const dbConfig = {
  user: 'COMP214_W24_zo_7',
  password: 'Zhambalov123!',
  connectString: '199.212.26.208:1521/SQLD'
};

oracledb.autoCommit = true;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM BAKERY_USERS WHERE LOWER(USERNAME) = LOWER(:username)`, 
      [username],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Username does not exist.' });
    }

    const user = result.rows[0];

    if (password === user.PASSWORD) {
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Password is incorrect.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error logging in' });
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

app.post('/api/cart/add', async (req, res) => {
  try {
    // Placeholder logic to add item to cart
    const { productId, quantity } = req.body;
    console.log('Adding item to cart:', { productId, quantity });

    // Your actual logic to add item to cart

    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    // Placeholder logic to fetch cart items
    console.log('Fetching cart items...');

    // Your actual logic to fetch cart items

    // Dummy response
    const cartItems = [
      { id: 1, name: 'Item 1', price: 10 },
      { id: 2, name: 'Item 2', price: 20 }
    ];

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
