const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'employeetracker'
  },
  console.log('Connected server')
);

module.exports = db;