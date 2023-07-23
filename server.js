const express = require('express');
const inquirer = require("inquirer");
const mysql = require('mysql2/promise');
const db = require('./db/connection');
const cTable = require('console.table');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res) => {
  res.status(404).end();
});

db.connect(err => {
  if (err) throw err;
  app.listen(PORT, () => {});
});

function startPrompt() {
  inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'What would you like to do?',
    choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employee Role', 'Delete Department', 'Delete Role', 'Delete Employee'],

  }).then( answer => {
    switch (answer.menu) {
      case 'View All Departments':
        viewAllDepartments();
        break;
    }
  })
}

function viewAllDepartments() {
  const sql = `SELECT * FROM department`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return;
    }
    console.table(result);
    startPrompt();
  });
}

startPrompt();