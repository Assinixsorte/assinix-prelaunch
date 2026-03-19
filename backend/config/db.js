const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',       // <- use DB_PASS
  database: process.env.DB_NAME || 'prelaunch_influencers',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(() => console.log('✅ Conectado ao MySQL'))
  .catch(err => console.error('Erro ao conectar ao MySQL:', err));

module.exports = pool;