const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'maglev.proxy.rlwy.net',
  user: 'root',
  password: 'ruJhTEEOaAFozhxWSlBQFvDDnBsIIlSh',
  database: 'railway',
  port: 43046
});

connection.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to Railway MySQL');
});

module.exports = connection;

