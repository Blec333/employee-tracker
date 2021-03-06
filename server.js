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

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



//==================================================================================================================
//PRIMARY FUNCTION - MAIN MENU======================================================================================
function mainMenu() {
  const questions = [
    inquirer
      .prompt([
        {
          type: 'list',
          message: 'What would you like to do?:',
          name: 'nextAction',
          choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'View All Managers',
            'View Personnel By Department',
            'Add Department',
            'Add Role',
            'Add Employee',
            'Update Employee',
            'Delete Department',
            'Delete Employee',
            'Delete Role',
            'Quit'
          ]
        }
      ])
      .then((response) => {
        if (response.nextAction === 'View All Departments') {
          viewDepartments(true);
        } else if (response.nextAction === 'View All Roles') {
          viewRoles(true);
        } else if (response.nextAction === 'View All Employees') {
          viewEmployees(true);
        } else if (response.nextAction === 'View All Managers') {
          viewManagers(true);
        } else if (response.nextAction === 'View Personnel By Department') {
          viewPersonnelByDept(true);
        } else if (response.nextAction === 'Add Department') {
          addDepartment(true);
        } else if (response.nextAction === 'Add Role') {
          addRole(true);
        } else if (response.nextAction === 'Add Employee') {
          addEmployee(true);
        } else if (response.nextAction === 'Update Employee') {
          updateEmployee(true);
        } else if (response.nextAction === 'Delete Department') {
          deleteDepartment(true);
        } else if (response.nextAction === 'Delete Employee') {
          deleteEmployee(true);
        } else if (response.nextAction === 'Delete Role') {
          deleteRole(true);
        } else if (response.nextAction === 'Quit') {
          quitApp(false);
        } else {
          console.log('Please choose a valid option.')
        }
      }
      )
  ];
}




// Quit the app message
function quitApp() {
  process.exit();
}
//PRIMARY FUNCTION - MAIN MENU======================================================================================
//==================================================================================================================



//==================================================================================================================
//VIEW THINGS=======================================================================================================
// -- WHEN I choose to view all departments
// -- THEN I am presented with a formatted table showing department names and department ids
function viewDepartments(menuStatus) {
  db.query('SELECT * FROM departments', function (err, results) {
    console.table(results);
    mainMenu();
  });
}

// -- WHEN I choose to view all roles
// -- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewRoles(menuStatus) {
  db.query(`SELECT 
  r.id,
  r.title, 
  concat(d.id, ' - ', d.department) AS department, 
  r.salary 
  FROM roles r 
  LEFT JOIN departments d ON r.department_id = d.id`, function (err, results) {
    console.table(results);
    mainMenu();
  });
}

// -- WHEN I choose to view all employees
// -- THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewEmployees(menuStatus) {
  db.query(`SELECT 
  e.id, 
  concat(e.firstName, ' ', e.lastName) AS name, 
  concat(r.id, ' - ', r.title) AS title, 
  concat(d.id, ' - ', d.department) AS department, 
  r.salary, 
  concat(m.id, ' - ', m.firstName, ' ', m.lastName) AS managers 
  FROM employees e 
  LEFT JOIN employees m ON e.manager_id = m.id 
  LEFT JOIN roles r ON e.role_id = r.id 
  LEFT JOIN departments d ON r.department_id = d.id`, function (err, results) {
    console.table(results);
    mainMenu();
  });
}

// View managers function
function viewManagers(menuStatus) {
  console.log(`Managers: `);
  db.query(`SELECT id, concat(firstName, ' ', lastName) AS name FROM employees WHERE manager_id IS NULL`, function (err, results) {
    console.table(results);
    mainMenu();
  });
}

function viewPersonnelByDept(menuStatus) {
  db.query(`SELECT 
  concat(d.id, ' - ', d.department) AS department, 
  concat(e.id, ' - ', e.firstName, ' ', e.lastName) AS name, 
  concat(r.id, ' - ', r.title) AS title, 
  r.salary, 
  concat(m.id, ' - ', m.firstName, ' ', m.lastName) AS managers 
  FROM employees e 
  LEFT JOIN employees m ON e.manager_id = m.id 
  LEFT JOIN roles r ON e.role_id = r.id 
  LEFT JOIN departments d ON r.department_id = d.id
  ORDER BY d.id ASC, r.id ASC`, function (err, results) {
    console.table(results);
    mainMenu();
  });
}
//VIEW THINGS=======================================================================================================
//==================================================================================================================




//==================================================================================================================
//ADD THINGS========================================================================================================
// -- WHEN I choose to add a department
// -- THEN I am prompted to enter the name of the department and that department is added to the database
function addDepartment(menuStatus) {
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
        if (response.name) {
          db.query(`INSERT INTO departments (department) VALUES ("${response.name}")`, function (err, results) {
            mainMenu();
          });
        } else {
          console.log(`Provided information was incomplete, please try again`);
          console.log(`Entered department name was: ${response.name}`);
          mainMenu();
        }
      })
  ];
}

// -- WHEN I choose to add a role
// -- THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole(menuStatus) {
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
            mainMenu();
          });
        } else {
          console.log(`Provided information was incomplete, please try again`);
          console.log(`Entered title was: ${response.title}`);
          console.log(`Entered department_id was: ${response.department_id}`);
          console.log(`Entered salary was: ${response.salary}`);
          mainMenu();
        }
      })
  ];
}

// -- WHEN I choose to add an employee
// -- THEN I am prompted to enter the employee???s first name, last name, role, and manager, and that employee is added to the database
function addEmployee(menuStatus) {
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
          message: 'What is this employee\'s role ID?',
          name: 'role_id'
        },
        {
          type: 'input',
          message: 'Who is this employee\'s manager (by ID)?',
          name: 'manager_id'
        }
      ])
      .then((response) => {
        if (response.firstName && response.lastName && response.role_id && response.manager_id) {
          db.query(`INSERT INTO employees (firstName, lastName, role_id, manager_id) VALUES ("${response.firstName}", "${response.lastName}", ${response.role_id}, ${response.manager_id})`, function (err, results) {
            mainMenu();
          });
        } else {
          console.log(`Provided information was incomplete, please try again`);
          console.log(`Entered first name was: ${response.firstName}`);
          console.log(`Entered last name was: ${response.lastName}`);
          console.log(`Entered role ID was: ${response.role_id}`);
          console.log(`Entered manager was: ${response.manager_id}`);
          mainMenu();
        }
      })
  ];
}
//ADD THINGS========================================================================================================
//==================================================================================================================




//==================================================================================================================
//UPDATE THINGS=====================================================================================================
// -- WHEN I choose to update an employee role
// -- THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
function updateEmployee(menuStatus) {
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
          name: 'manager_id'
        }
      ])
      .then((response) => {
        if (response.firstName !== '') {
          db.query(`UPDATE employees SET firstName = '${response.firstName}' WHERE id = ?`, response.id, function (err, results) {
            console.log(` `);
          });
        }
        if (response.lastName !== '') {
          db.query(`UPDATE employees SET lastName = '${response.lastName}' WHERE id = ?`, response.id, function (err, results) {
            console.log(` `);
          });
        }
        if (response.role_id !== '') {
          db.query(`UPDATE employees SET role_id = ${response.role_id} WHERE id = ?`, response.id, function (err, results) {
            console.log(` `);
          });
        }
        if (response.manager_id !== '') {
          db.query(`UPDATE employees SET manager_id = ${response.manager_id} WHERE id = ?`, response.id, function (err, results) {
            console.log(` `);
          });
        }
      })
      .then((response) => {
        mainMenu();
      })
  ];
}
//UPDATE THINGS=====================================================================================================
//==================================================================================================================





//==================================================================================================================
//DELETE THINGS=====================================================================================================
function deleteEmployee(menuStatus) {
  const questions = [
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Which employee would you like to delete? (Enter ID)',
          name: 'id'
        }
      ])
      .then((response) => {
        if (response.firstName !== '') {
          db.query(`DELETE FROM employees WHERE id = ?`, response.id, function (err, results) {
            mainMenu();
            console.log(` `);
          });
        }
      })
  ];
}

function deleteRole(menuStatus) {
  const questions = [
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Which role would you like to delete? (Enter ID)',
          name: 'id'
        }
      ])
      .then((response) => {
        if (response.firstName !== '') {
          db.query(`DELETE FROM roles WHERE id = ?`, response.id, function (err, results) {
            console.log(` `);
          });
        }
      })
  ];
}

function deleteDepartment(menuStatus) {
  const questions = [
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Which department would you like to delete? (Enter ID)',
          name: 'id'
        }
      ])
      .then((response) => {
        if (response.firstName !== '') {
          db.query(`DELETE FROM departments WHERE id = ?`, response.id, function (err, results) {
            console.log(` `);
          });
        }
      })
  ];
}


//DELETE THINGS=====================================================================================================
//==================================================================================================================

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
  console.log(`                                    `);
  console.log(``);
  mainMenu();
}

init();

