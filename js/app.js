// app.js
const express = require('express');
const connectToDatabase = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/cart', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    // Retrieve cart data from the database
    // Send cart data as JSON response
    res.json({ message: 'Cart data retrieved successfully' });
  } catch (err) {
    console.error('Error retrieving cart data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/cart', async (req, res) => {
  try {
    const connection = await connectToDatabase();
    // Add item to cart in the database
    res.json({ message: 'Item added to cart successfully' });
  } catch (err) {
    console.error('Error adding item to cart:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add more endpoints for updating and deleting cart items

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
