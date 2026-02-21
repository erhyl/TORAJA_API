
const mysql = require('mysql2');


const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',          // your MySQL username
  password: '',          // your MySQL password
  database: 'school_db', 
  waitForConnections: true,
  connectionLimit: 10,  
  queueLimit: 0
});


pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
  } else {
    console.log('Connected to MySQL database!');
    connection.release(); 
  }
});

module.exports = pool;
