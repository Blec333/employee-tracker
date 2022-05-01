
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

    // TODO: db.query all roles
    mainMenu();
}

function viewAllDepartments() {

    // TODO: db.query all departments
    mainMenu();
}

function viewAllEmployees() {

    // TODO: db.query all employees
    mainMenu();
}


function updateEmployeeRole() {

}
