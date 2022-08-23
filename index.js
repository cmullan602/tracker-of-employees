const inquirer = require('inquirer');
const mysql = require('mysql2');
const utils = require('util');

const db = mysql.createConnection(
    {
      host: 'localhost',
    
      user: 'root',
     
      password: 'openstreet92',

      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

db.query = utils.promisify(db.query);

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
            updateEmployees();
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
    const departments = await db.query("SELECT * FROM departments");

    console.log(departments)

}


//View all roles
const viewRoles = async () => {
//SELECT * FROM role;
    const roles = await db.query("SELECT * FROM roles");

    console.log(roles)

}


// View all employees
const viewEmployees = async () => {
// SELECT * FROM employees;
    const employees = await db.query("SELECT * FROM employees")

    console.log(employees)
}


// Create new departments
const createDepartment = async () => {
// prompt the user for the name of the department 
    const answers = await inquirer.prompt([
        {
            message: "What is the name of the department?",
            name: "names",
            type: "input"
        }
    ]);
//Run the query 
    await db.query(
        "INSERT INTO departments (names) VALUES (?)",
        [answers.names]
    )

    console.log(`${answers.names} added.`)
//Ask the user what they want to do next 
start()

}



// Create a new role
const createRole = async () => {
// Get the existing department from the department table
    const departments = await db.query("SELECT * FROM departments");

    const departmentChoices = departments.map( department => ({
        department: department.names,
        value: department.id
    }) );

    console.log(departmentChoices)
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
        "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
        [answers.title, answers.salary, answers.department_id]
    )

//THEN ask the user what they want to do next 

}

//CREATE new Employee
const createNewEmployee = async () => {
//Get Existing roles 
    const roles = await db.query("SELECT * FROM roles");

    const roleChoices = roles.map( role => ({
        role: role.title,
        value: role.id
    }) );

    const managers = await db.query("SELECT * FROM employees");

    const managerChoices = managers.map( manager => ({
        manager: manager.first_name,
        value: manager.id
    }))

    console.log(managerChoices)

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

    console.log(answers)
}


  



createNewEmployee()