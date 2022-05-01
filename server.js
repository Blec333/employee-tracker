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


// -- WHEN I choose to view all roles
// -- THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role


// -- WHEN I choose to view all employees
// -- THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to


// -- WHEN I choose to add a department
// -- THEN I am prompted to enter the name of the department and that department is added to the database


// -- WHEN I choose to add a role
// -- THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database


// -- WHEN I choose to add an employee
// -- THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// -- WHEN I choose to update an employee role
// -- THEN I am prompted to select an employee to update and their new role and this information is updated in the database 




// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

