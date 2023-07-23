const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'employeeTracker'
  },
  console.log('Connected server')
);

module.exports = db;