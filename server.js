const connection = require('./db/connection');
const inquirer = require("inquirer");
const chalk = require("chalk");
const cTable = require('console.table');
prompt = inquirer.createPromptModule();

connection.connect((error) => {
  if (error) throw error;
});

prompt([
  {
    type: "list",
    message: `${chalk.black.bgBlueBright(
      "Welcome to Employee Manager"
    )}`,
    choices: ["Continue", "Quit"],
    name: "start",
  },
]).then((response) => {
  switch (response.start) {
    case "Continue":
      menu();
      break;
    case "Quit":
      return console.log("Restart the application and try again.");
  }
});

function menu() {
  prompt([
    {
      name: "choices",
      type: "list",
      message: `${chalk.black.bgYellowBright(
        "What would you like to do?"
      )}`,
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "Update Employee Role",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Exit",
      ],
    },
  ]).then((answers) => {
    const { choices } = answers;
    if (choices === "View All Employees") {
      viewAllEmployees();
    }
    if (choices === "View All Roles") {
      viewAllRoles();
    }
    if (choices === "View All Departments") {
      viewAllDepartments();
    }
    if (choices === "Update Employee Role") {
      updateEmployeeRole();
    }
    if (choices === "Add Employee") {
      addEmployee();
    }
    if (choices === "Add Role") {
      addRole();
    }
    if (choices === "Add Department") {
      addDepartment();
    }
    if (choices === "Exit") {
      console.log("Thanks for using Employee Tracker. Until next time.");
      connection.end();
    }
  });
}

const viewAllEmployees = () => {
  let sql = `SELECT DISTINCT employee.id, 
              employee.first_name, 
              employee.last_name, 
              role.title, 
              department.department_name AS 'department', 
              role.salary,
              CONCAT(e.first_name, ' ' ,e.last_name) AS manager 
              FROM employee 
              INNER JOIN role on role.id = employee.role_id 
              INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id`;

  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(`${chalk.green("All Employees:\n")}`);
    console.table(response);
    menu();
  });
};

const viewAllRoles = () => {
  let sql = `SELECT role.id, role.title, department.department_name AS department
  FROM role
  INNER JOIN department ON role.department_id = department.id`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(
      "------------------------------------------------------------------"
    );
    console.log(`${chalk.cyan("List of Roles:\n")}`);
    response.forEach((role) => {
      console.table(role.title);
    });
    console.log(
      "------------------------------------------------------------------"
    );
    menu();
  });
};

const viewAllDepartments = () => {
  let sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
  connection.query(sql, (error, response) => {
    if (error) throw error;
    console.log(
      "------------------------------------------------------------------"
    );
    console.log(`${chalk.cyan("List of Departments:\n")}`);
    console.table(response);
    console.log(
      "------------------------------------------------------------------"
    );
    menu();
  });
};

const addEmployee = () => {
  prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
    },
  ]).then((answer) => {
    const crit = [answer.firstName, answer.lastName];
    const roleSql = `SELECT role.id, role.title FROM role`;
    connection.query(roleSql, (error, data) => {
      if (error) throw error;
      const roles = data.map(({ id, title }) => ({ name: title, value: id }));
      prompt([
        {
          type: "list",
          name: "role",
          message: "What is the employee's role?",
          choices: roles,
        },
      ]).then((roleChoice) => {
        const role = roleChoice.role;
        crit.push(role);
        const managerSql = `SELECT * FROM employee`;
        connection.query(managerSql, (error, data) => {
          if (error) throw error;
          const managers = data.map(({ id, first_name, last_name }) => ({
            name: first_name + " " + last_name,
            value: id,
          }));
          prompt([
            {
              type: "list",
              name: "manager",
              message: "Who is the employee's manager?",
              choices: managers,
            },
          ]).then((managerChoice) => {
            const manager = managerChoice.manager;
            crit.push(manager);
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                  VALUES (?, ?, ?, ?)`;
            connection.query(sql, crit, (error) => {
              if (error) throw error;
              console.log(
                "------------------------------------------------------------------"
              );
              console.log("Employee added successfully!");
              viewAllEmployees();
            });
          });
        });
      });
    });
  });
};

const addRole = () => {
  const sql = "SELECT * FROM department";
  connection.query(sql, (error, response) => {
    if (error) throw error;
    let deptNamesArray = [];
    response.forEach((department) => {
      deptNamesArray.push(department.department_name);
    });
    deptNamesArray.push("Create Department");
    prompt([
      {
        name: "departmentName",
        type: "list",
        message: "Which department does the role belong to?",
        choices: deptNamesArray,
      },
    ]).then((answer) => {
      if (answer.departmentName === "Create Department") {
        this.addDepartment();
      } else {
        addRoleResume(answer);
      }
    });

    const addRoleResume = (departmentData) => {
      prompt([
        {
          name: "newRole",
          type: "input",
          message: "What is the name of the role?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary of the role?",
        },
      ]).then((answer) => {
        let createdRole = answer.newRole;
        let departmentId;

        response.forEach((department) => {
          if (departmentData.departmentName === department.department_name) {
            departmentId = department.id;
          }
        });

        let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        let crit = [createdRole, answer.salary, departmentId];

        connection.query(sql, crit, (error) => {
          if (error) throw error;
          console.log(
            "------------------------------------------------------------------"
          );
          console.log("Role created successfully!");
          viewAllRoles();
        });
      });
    };
  });
};

const addDepartment = () => {
  prompt([
    {
      name: 'newDepartment',
      type: 'input',
      message: 'What is the name of the department.'
    }
  ])
    .then((answer) => {
      let sql = `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.log(
          "------------------------------------------------------------------"
        );
        console.log("Added " + answer.newDepartment + " to the data base");
        viewAllDepartments();
      });
    });
};

const updateEmployeeRole = () => {

  let employeesArray = []

  connection.query(
    `SELECT first_name, last_name FROM employee`,
    (err, res) => {
      if (err) throw err;
      prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee's role do you want yo update?",
          choices() {
            res.forEach(employee => {
              employeesArray.push(`${employee.first_name} ${employee.last_name}`);
            });
            return employeesArray;
          }
        },
        {
          type: "input",
          name: "role",
          message: `Enter the new role ID from the choices below.${chalk.cyan('\nDesigner: 1\nSales Lead 2\nSalesperson 3\nLead Engineer 4\nSoftware Engineer 5\nAccountant Manager 6\nAccountant 7\nLegal Team Lead 8\n' + chalk.cyan('Your Answer: '))}`
        }
      ]).then((answers) => {

        const updateEmployeeRole = answers.employee.split(' ');
        const updateEmployeeRoleFirstName = JSON.stringify(updateEmployeeRole[0]);
        const updateEmployeeRoleLastName = JSON.stringify(updateEmployeeRole[1]);

        connection.query(
          `UPDATE employee
                  SET role_id = ${answers.role}
                  WHERE first_name = ${updateEmployeeRoleFirstName}
                  AND last_name = ${updateEmployeeRoleLastName}`,

          (err, res) => {
            if (err) throw err;
            console.log(
              "------------------------------------------------------------------"
            );
            console.log("Employee role updated successfully!");
            viewAllEmployees();
          }
        );
      });
    }
  );
};