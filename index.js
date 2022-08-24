const inquirer = require('inquirer');
const mysql = require('mysql2');
const utils = require('util');
require('console.table');
const logo = require("asciiart-logo");

const db = mysql.createConnection(
    {
      host: 'localhost',
    
      user: 'root',
     
      password: 'openstreet92',

      database: 'employee_db'
    },
  );

db.query = utils.promisify(db.query);


//pretty drawing
function init (){
    const logoText = logo({ name: "Employee Manager" }).render();
    console.log(logoText);

    start()
}
  
//Start application 
const start = async () => {

    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'start',
            message: 'What do you want to do?',
            choices: [
             'View All Employees',
               'Add Employee',
               'Update Employee Role',
               'View All Roles',
               'Add Role',
               'View All Departments',
               'Add Department'
            ],
            initial: 1
          },
    ]);

    const choice = answers.start;

    switch(choice) {
        case 'View All Employees':
            viewEmployees();
            break;
        case 'Add Employee':
            createNewEmployee();
            break;
        case 'Update Employee Role':
            updateEmployee();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'Add Role':
            createRole();
            break;
        case 'View All Departments':
            viewDepartments();
            break;
        case 'Add Department':
            createDepartment();
            break;
        default:
            console.log('no working')
            
        
    }
}

//View all departments
const viewDepartments = async () => {
//SELECT * FROM department;
    const departments = await db.query("SELECT * FROM department");

    console.table(departments);

    start();

}

//View all roles
const viewRoles = async () => {
//SELECT * FROM role;
    const roles = await db.query("SELECT * FROM role");

    console.table(roles);
    
    start();

}

// View all employees
const viewEmployees = async () => {
// SELECT * FROM employees;
    const employees = await db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, concat(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id")

    console.table(employees);

    start();
}

// Create new departments
const createDepartment = async () => {
// prompt the user for the name of the department 
    const answers = await inquirer.prompt([
        {
            message: "What is the name of the department?",
            name: "name",
            type: "input"
        }
    ]);
//Run the query 
    await db.query(
        "INSERT INTO department (name) VALUES (?)",
        [answers.name]
    )

    console.log(`${answers.name} added.`)
//Ask the user what they want to do next 
start()

}

// Create a new role
const createRole = async () => {
// Get the existing department from the department table
    const department = await db.query("SELECT * FROM department");

    const departmentChoices = department.map( department => ({
        value: department.id,
        name: department.name
    }) );

//prompt the user for "title", "Salary" and "department" for the role
    const answers = await inquirer.prompt([
        {
            message: "What is the title of the role?",
            name: "title",
            type: "input"
        },
        {
            message: "What is the salary of the role?",
            name: "salary",
            type: "input"
        },
        {
            message: "What is the department?",
            name: "department_id",
            type: "list",
            choices: departmentChoices
        }
    ]);
    // INSERT INTO role (title, salary, department_id)
    await db.query(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [answers.title, answers.salary, answers.department_id]
    )

    console.log(`${answers.title} added.`)
//THEN ask the user what they want to do next 
    start();

}

//CREATE new Employee
const createNewEmployee = async () => {
//Get Existing roles 
    const roles = await db.query("SELECT * FROM role");
//map roles
    const roleChoices = roles.map( role => ({
        name: role.title,
        value: role.id
    }) );
//get managers
    const managers = await db.query("SELECT * FROM employee");
//map managers
    const managerChoices = managers.map( manager => ({
        name:`${manager.first_name} ${manager.last_name}`,
        value: manager.id
    }))

//prompt user
    const answers = await inquirer.prompt([
        {
            message: "What is the employees first name?",
            name: "first_name",
            type: "input"
        },
        {
            message: "What is the employees last name?",
            name: "last_name",
            type: "input"
        },
        {
            message: "What is the employees role?",
            name: "role_id",
            type: "list",
            choices: roleChoices
        },
        {
            message: "Who is the employees manager?",
            name: "manager_id",
            type: "list",
            choices: managerChoices
        }
    ]);
//add employee to database
    await db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
    );

    console.log(`${answers.first_name} ${answers.last_name} added.`)
//ask user what they want to do next
    start();
}

//update Employee
const updateEmployee = async () => {
//get employees
    const employees = await db.query("SELECT * FROM employee")
//map employees
    const employeeChoices = employees.map( employee => ({
        name: `${employee.first_name} ${employee.last_name}`, 
        value: employee.id
    }))
//prompt user
    const answers = await inquirer.prompt([
    {
        message: "Which employee do you want to update?",
        name: "employee_id",
        type: "list",
        choices: employeeChoices
    }

    ]);
//get existing roles
    const role = await db.query("SELECT * FROM role")
//map roles
    const roleChoices = role.map( role => ({
        name: role.title,
        value: role.id
    }))
//prompt user
    const answers2 = await inquirer.prompt([
        {
            message: "What is the employees new role?",
            name: "role_id",
            type: "list",
            choices: roleChoices
        }
    ]);
//push updated to DB
    await db.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [answers2.role_id, answers.employee_id]
    )

console.log(`Employee updated.`)
//ask user what they want to do next 
    start()
}

//start the Application
init()