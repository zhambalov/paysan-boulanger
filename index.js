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
          `SELECT USER_ID, PASSWORD FROM BAKERY_USERS WHERE LOWER(USERNAME) = LOWER(:username)`,
          [username],
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (result.rows.length === 0) {
          res.status(401).json({ error: 'Username does not exist.' });
      } else {
          const user = result.rows[0];
          if (password === user.PASSWORD) {
              res.json({ message: 'Login successful', userId: user.USER_ID });
          } else {
              res.status(401).json({ error: 'Password is incorrect.' });
          }
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error logging in' });
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
  const { userId, productId, quantity } = req.body;
  let connection;

  try {
      connection = await oracledb.getConnection(dbConfig);
      const cartItemResult = await connection.execute(
          `SELECT ITEM_ID, QUANTITY FROM BAKERY_CART_ITEMS WHERE CART_ID IN (SELECT CART_ID FROM BAKERY_CART WHERE USER_ID = :userId) AND PRODUCT_ID = :productId`,
          { userId, productId },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (cartItemResult.rows.length > 0) {
          const item = cartItemResult.rows[0];
          const newQuantity = item.QUANTITY + quantity;
          await connection.execute(
              `UPDATE BAKERY_CART_ITEMS SET QUANTITY = :newQuantity WHERE ITEM_ID = :itemId`,
              { newQuantity, itemId: item.ITEM_ID }
          );
      } else {
          const cartResult = await connection.execute(
              `SELECT CART_ID FROM BAKERY_CART WHERE USER_ID = :userId`,
              { userId },
              { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );

          if (cartResult.rows.length === 0) {
              res.status(404).json({ error: 'No cart found for user.' });
              return;
          }

          const cartId = cartResult.rows[0].CART_ID;
          await connection.execute(
              `INSERT INTO BAKERY_CART_ITEMS (CART_ID, PRODUCT_ID, QUANTITY) VALUES (:cartId, :productId, :quantity)`,
              { cartId, productId, quantity }
          );
      }

      res.json({ message: 'Cart updated successfully' });
  } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({ error: 'Error updating cart', details: error.message });
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


app.post('/api/cart/complete-order', async (req, res) => {
  const { userId } = req.body;
  let connection;

  try {
      connection = await oracledb.getConnection(dbConfig);

      const insertSql = `
          INSERT INTO BAKERY_COMPLETE_ORDERS (CART_ID, USER_ID, PRODUCT_ID, QUANTITY)
          SELECT c.CART_ID, c.USER_ID, ci.PRODUCT_ID, ci.QUANTITY
          FROM BAKERY_CART_ITEMS ci
          INNER JOIN BAKERY_CART c ON ci.CART_ID = c.CART_ID
          WHERE c.USER_ID = :userId
      `;

      await connection.execute(insertSql, [userId], { autoCommit: false });

      const deleteSql = `
          DELETE FROM BAKERY_CART_ITEMS
          WHERE CART_ID = (SELECT CART_ID FROM BAKERY_CART WHERE USER_ID = :userId)
      `;
      await connection.execute(deleteSql, [userId], { autoCommit: false });

      await connection.commit(); 

      res.json({ message: 'Order completed successfully' });
  } catch (error) {
      await connection.rollback(); // Rollback in case of an error
      console.error('Error completing order:', error);
      res.status(500).json({ error: 'Error completing order', details: error.message });
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




app.get('/api/cart', async (req, res) => {
  const { userId } = req.query;

  let connection;
  try {
      connection = await oracledb.getConnection(dbConfig);
      const sql = `
      SELECT bci.QUANTITY, bci.PRODUCT_ID, bp.NAME, bp.PRICE
      FROM BAKERY_CART_ITEMS bci
      JOIN BAKERY_CART bc ON bci.CART_ID = bc.CART_ID
      JOIN BAKERY_PRODUCTS bp ON bci.PRODUCT_ID = bp.PRODUCT_ID
      WHERE bc.USER_ID = :userId
      `;


      const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
      const result = await connection.execute(sql, [userId], options);

      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ error: 'Failed to fetch cart items' });
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




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
