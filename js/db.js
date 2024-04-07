// db.js
const oracledb = require('oracledb');

async function connectToDatabase() {
  try {
    await oracledb.initOracleClient({}); 
    const connection = await oracledb.getConnection({
      user: 'COMP214_W24_zo_7',
      password: 'Zhambalov123!',
      connectString: '199.212.26.208'
    });
    console.log('Connected to Oracle Database');
    return connection;
  } catch (err) {
    console.error('Error connecting to Oracle Database:', err);
  }
}

module.exports = connectToDatabase;
