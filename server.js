const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const { Console } = require('console');
// const table = require('console.table');
// const index = require('./public/assets/js/index.js');

// Using express and defining server port
const app = express();
const PORT = process.env.PORT || 3000;


//MIDDLEWARE:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// app.use('/api', apiRouter);

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
);



function createTables() {
  db.query('SOURCE ./db/schema.sql', function (err, results) {
    console.log(results);
  });
}


function seedTables() {
  db.query('SOURCE ./db/seeds.sql', function (err, results) {
    console.log(results);
  });
}


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



//==================================================================================================================
//PRIMARY FUNCTION - MAIN MENU======================================================================================
//==================================================================================================================

function mainMenu() {
  const questions = [
    inquirer
      .prompt([
        {
          type: 'list',
          message: 'What would you like to do?:',
          name: 'nextAction',
          choices: [
            'Update Employee Role',
            'View All Roles',
            'Add Role',
            'View All Departments',
            'Add Department',
            'View All Employees',
            'Add Employee',
            'Quit'
          ]
        }
      ])
      .then((response) => {
        if (response.nextAction === 'Update Employee Role') {
          updateEmployeeRole();
        } else if (response.nextAction === 'View All Roles') {
          viewRoles();
        } else if (response.nextAction === 'Add Role') {
          addRole();
        } else if (response.nextAction === 'View All Departments') {
          viewDepartments();
        } else if (response.nextAction === 'Add Department') {
          addDepartment();
        } else if (response.nextAction === 'View All Employees') {
          viewEmployees();
        } else if (response.nextAction === 'Add Employee') {
          addEmployees();
        } else if (response.nextAction === 'Quit') {
          quitApp();
        } else {
          console.log('Please choose a valid option.')
        }
      }
      )
  ];
}

// Quit the app message
function quitApp() {
  console.log('Bye!');
  return;
}

//==================================================================================================================
//VIEW THINGS=======================================================================================================
//==================================================================================================================

// -- WHEN I choose to view all departments
// -- THEN I am presented with a formatted table showing department names and department ids
function viewDepartments() {
  console.log(` `);
  db.query('SELECT * FROM departments', function (err, results) {
    console.table(results);
    console.log(` `);
    mainMenu();
  });
}

// -- WHEN I choose to view all roles
// -- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewRoles() {
  console.log(` `);
  db.query('SELECT r.id, title, d.department, r.salary FROM roles AS r INNER JOIN departments AS d ON r.department_id = d.id', function (err, results) {
    console.table(results);
    console.log(` `);
    mainMenu();
  });
}

// -- WHEN I choose to view all employees
// -- THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewEmployees() {
  console.log(` `);
  db.query(`SELECT e.id, e.firstName, e.lastName, r.title, d.department, r.salary, concat(m.firstName, ' ', m.lastName) AS managers FROM employees e LEFT JOIN employees m ON e.manager_id = m.id LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN departments d ON r.department_id = d.id`, function (err, results) {
    console.table(results);
    console.log(` `);
    mainMenu();
  });
}

// View managers function
function viewManagers() {
  console.log(`Managers: `);
  db.query('SELECT id, firstName, lastName FROM employees WHERE manager_id IS NULL', function (err, results) {
    console.table(results);
    console.log(` `);
    mainMenu();
  });
}

// View employee ids and names in one column function
function viewEmployeeIDsNames() {
  console.log(`Managers: `);
  db.query(`SELECT concat(id,' ', firstName,' ', lastName) AS employees FROM employees`, function (err, results) {
    console.table(results);
    console.log(` `);
    mainMenu();
  });
}

//==================================================================================================================
//VIEW THINGS=======================================================================================================
//==================================================================================================================




//==================================================================================================================
//ADD THINGS========================================================================================================
//==================================================================================================================

// -- WHEN I choose to add a department
// -- THEN I am prompted to enter the name of the department and that department is added to the database

function addDepartment() {
  viewDepartments();
  const questions = [
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'What is this dept to be called?',
          name: 'name'
        }
      ])
      .then((response) => {
        console.log(` `);
        if (response.name) {
          db.query(`INSERT INTO departments (department) VALUES ("${response.name}")`, function (err, results) {
            console.table(`Added ${results} to table!`);
            console.log(` `);
            mainMenu();
          });
        } else {
          console.log(`Provided information was incomplete, please try again`);
          console.log(`Entered department name was: ${response.name}`);
          console.log(` `);
          mainMenu();
        }
      })
  ];
}

// -- WHEN I choose to add a role
// -- THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole() {
  viewDepartments();
  viewRoles();
  const questions = [
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'What is this role to be called?',
          name: 'title'
        },
        {
          type: 'input',
          message: 'What is this role\'s department? (Please see above for reference)',
          name: 'department_id'
        },
        {
          type: 'input',
          message: 'What salary is this role expected to receive?',
          name: 'salary'
        }
      ])
      .then((response) => {
        if (response.title && response.department_id && response.salary) {
          console.log(` `);
          db.query(`INSERT INTO roles (title, department_id, salary) VALUES ("${response.title}", ${response.department_id}, "${response.salary}")`, function (err, results) {
            console.table(`Added ${results} to table!`);
            console.log(` `);
            mainMenu();
          });
        } else {
          console.log(`Provided information was incomplete, please try again`);
          console.log(`Entered title was: ${response.title}`);
          console.log(`Entered department_id was: ${response.department_id}`);
          console.log(`Entered salary was: ${response.salary}`);
          console.log(` `);
          mainMenu();
        }
      })
  ];
}

// -- WHEN I choose to add an employee
// -- THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee() {
  viewRoles();
  const questions = [
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'What is this employee\'s first name?',
          name: 'firstName'
        },
        {
          type: 'input',
          message: 'What is this employee\'s last name?',
          name: 'lastName'
        },
        {
          type: 'input',
          message: 'What is this employee\'s role ID? (Please see above for reference)',
          name: 'role_id'
        },
        {
          type: 'input',
          message: 'Who is this employee\'s manager?',
          name: 'manager'
        }
      ])
      .then((response) => {
        if (response.firstName && response.lastName && response.role_id && response.manager) {
          console.log(` `);
          db.query(`INSERT INTO employees (firstName, lastName, role_id, manager) VALUES ("${response.firstName}", "${response.lastName}", ${response.role_id}, ${response.manager})`, function (err, results) {
            console.table(`Added ${results} to table!`);
            console.log(` `);
            mainMenu();
          });
        } else {
          console.log(`Provided information was incomplete, please try again`);
          console.log(`Entered first name was: ${response.firstName}`);
          console.log(`Entered last name was: ${response.lastName}`);
          console.log(`Entered role ID was: ${response.role_id}`);
          console.log(`Entered manager was: ${response.manager}`);
          console.log(` `);
          mainMenu();
        }
      })
  ];
}

//==================================================================================================================
//ADD THINGS========================================================================================================
//==================================================================================================================




//==================================================================================================================
//UPDATE THINGS=====================================================================================================
//==================================================================================================================

// -- WHEN I choose to update an employee role
// -- THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
function updateEmployee() {
  viewEmployees();
  viewEmployeeIDsNames()
  const questions = [
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Which employee would you like to update? (Enter ID)',
          name: 'id'
        },
        {
          type: 'input',
          message: 'If you wish to update this employee\'s first name, enter the new name here, else press enter to proceed:',
          name: 'firstName'
        },
        {
          type: 'input',
          message: 'If you wish to update this employee\'s last name, enter the new name here, else press enter to proceed:',
          name: 'lastName'
        },
        {
          type: 'input',
          message: 'What is this employee\'s role ID? (Please see above for reference)',
          name: 'role_id'
        },
        {
          type: 'input',
          message: 'Who is this employee\'s manager?',
          name: 'manager'
        }
      ])
      .then((response) => {













        if (response.firstName && response.lastName && response.role_id && response.manager) {
          console.log(` `);


          // `UPDATE employees SET firstName = ${response.firstName} WHERE id = '${response.id}'`;



          db.query(`INSERT INTO employees (firstName, lastName, role_id, manager) VALUES ("${response.firstName}", "${response.lastName}", ${response.role_id}, ${response.manager})`, function (err, results) {
            console.table(`Added ${results} to table!`);
            console.log(` `);
            mainMenu();
          });
        } else {
          console.log(`Provided information was incomplete, please try again`);
          console.log(`Entered first name was: ${response.firstName}`);
          console.log(`Entered last name was: ${response.lastName}`);
          console.log(`Entered role ID was: ${response.role_id}`);
          console.log(`Entered manager was: ${response.manager}`);
          console.log(` `);
          mainMenu();
        }









      })
  ];
}

//==================================================================================================================
//UPDATE THINGS=====================================================================================================
//==================================================================================================================








// db.query("DELETE FROM favorite_books WHERE id = ?", deletedRow, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });













function prompt() {
  const questions = [
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'What is ?',
          name: 'name'
        }
      ])
      .then((response) => {
      })
  ];
}



function init() {
  console.log(`                                    `);
  console.log(`  _____           _                 `);
  console.log(` |   __|_____ ___| |___ _ _ ___ ___ `);
  console.log(` |   __|     | . | | . | | | -_| -_|`);
  console.log(` |_____|_|_|_|  _|_|___|_  |___|___|`);
  console.log(`             |_|       |___|        `);
  console.log(`                                    `);
  console.log(`  _____                             `);
  console.log(` |     |___ ___ ___ ___ ___ ___     `);
  console.log(` | | | | .'|   | .'| . | -_|  _|    `);
  console.log(` |_|_|_|__,|_|_|__,|_  |___|_|      `);
  console.log(`                   |___|            `);
  console.log(`                                    `);
  createTables();
  seedTables();
  mainMenu();
}

init();

// module.exports = { db };

// module.exports = { viewDepartments, viewRoles, viewEmployees,  addDepartment, addRole, addEmployee };