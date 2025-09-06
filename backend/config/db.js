const mysql = require('mysql2');

// Debug: Check what environment variables are loaded
console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET'); // Changed from DB_PASS to DB_PASSWORD
console.log('DB_NAME:', process.env.DB_NAME || 'NOT SET');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,  // Make sure this matches your .env file
  database: process.env.DB_NAME
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('MySQL Connection Failed:', err);
  } else {
    console.log('MySQL Connected Successfully!');
  }
});

module.exports = db;