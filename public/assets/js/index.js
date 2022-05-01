
const inquirer = require('inquirer');
const fs = require("fs");
const server = require("./..//server.js");


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
                genHTMLCSS.appendHTMLCard(response.name, "Manager", response.id, response.email, response.info);
                if (response.nextAction === 'Update Employee Role') {
                    updateEmployeeRole();
                } else if (response.nextAction === 'View All Roles') {
                    viewAllRoles();
                } else if (response.nextAction === 'Add Role') {
                    addRole();
                } else if (response.nextAction === 'View All Departments') {
                    viewAllDepartments();
                } else if (response.nextAction === 'Add Department') {
                    addDepartment();
                } else if (response.nextAction === 'View All Employees') {
                    viewAllEmployees();
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

function viewAllRoles() {
    // db.query all roles
    server.viewRoles();
    mainMenu();
}

function viewAllDepartments() {
    // db.query all departments
    server.viewDepartments();
    mainMenu();
}

function viewAllEmployees() {
    // db.query all employees
    server.viewEmployees();
    mainMenu();
}

function addEmployee() {
    server.viewRoles();
    const questions = [
        inquirer
            .prompt([
                {
                    type: 'input',
                    message: 'What is this employee\'s first name?',
                    name: 'firstName'
                }
                {
                    type: 'input',
                    message: 'What is this employee\'s last name?',
                    name: 'lastName'
                }
                {
                    type: 'input',
                    message: 'What is this employee\'s role ID (Please see above for reference)?',
                    name: 'role_id'
                }
                {
                    type: 'input',
                    message: 'Who is this employee\'s manager?',
                    name: 'manager'
                }
            ])
            .then((response) => {
                if (server.addEmployee(firstName, lastName, role_id, manager) === false) {
                    mainMenu();
                } else {
                    mainMenu();
                }
            })
    ];
}


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
    mainMenu();
}

// Function call to initialize app
init();
