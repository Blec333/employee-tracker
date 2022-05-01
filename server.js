const express = require('express');
const mysql = require('mysql2');
const apiRouter = require('./routes/moviesApiRouter.js');

// Using express and defining server port
const app = express();
const PORT = process.env.PORT || 3000;


//MIDDLEWARE:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/api', apiRouter);

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




// -- WHEN I choose to view all departments
// -- THEN I am presented with a formatted table showing department names and department ids
function viewDepartments() {
  db.query('SELECT * FROM departments', function (err, results) {
    console.table(results);
  });
}

// -- WHEN I choose to view all roles
// -- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewRoles() {
  db.query('SELECT title, department, salary FROM roles AS r INNER JOIN departments AS d ON r.department_id = d.id', function (err, results) {
    console.table(results);
  });
}


// -- WHEN I choose to view all employees
// -- THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewEmployees() {
  db.query('SELECT e.id, e.firstName, e.lastName, r.title, d.department, r.salary, e.manager FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN departments d ON r.department_id = d.id', function (err, results) {
    console.table(results);
  });
}



// -- WHEN I choose to add a department
// -- THEN I am prompted to enter the name of the department and that department is added to the database
function addDepartment(name) {
  if (name) {
  db.query(`INSERT INTO departments (department) VALUES ("${name}")`, function (err, results) {
    console.table(`Added ${results} to table!`);
    return true;
  });
  } else {
    console.log(`Provided information was incomplete, please try again`);
    console.log(`Entered department name was: ${name}`);
    return false;
  }
}


// -- WHEN I choose to add a role
// -- THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole(title, department_id, salary) {
  if (title && department_id && salary) {
  db.query(`INSERT INTO roles (title, department_id, salary) VALUES ("${title}", ${department_id}, "${salary}")`, function (err, results) {
    console.table(`Added ${results} to table!`);
    return true;
  });
} else {
  console.log(`Provided information was incomplete, please try again`);
  console.log(`Entered title was: ${title}`);
  console.log(`Entered department_id was: ${department_id}`);
  console.log(`Entered salary was: ${salary}`);
  return false;
}
}


// -- WHEN I choose to add an employee
// -- THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee(firstName, lastName, role_id, manager) {
  if (firstName && lastName && role_id && manager) {
  db.query(`INSERT INTO employees (firstName, lastName, role_id, manager) VALUES ("${firstName}", "${lastName}", ${role_id}, ${manager})`, function (err, results) {
    console.table(`Added ${results} to table!`);
    return true;
  });
} else {
  console.log(`Provided information was incomplete, please try again`);
  console.log(`Entered first name was: ${firstName}`);
  console.log(`Entered last name was: ${lastName}`);
  console.log(`Entered role ID was: ${role_id}`);
  console.log(`Entered manager was: ${manager}`);
  return false;
}
}


// -- WHEN I choose to update an employee role
// -- THEN I am prompted to select an employee to update and their new role and this information is updated in the database 




// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

