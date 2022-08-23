const inquirer = require('inquirer');
const mysql2 = require('mysql2');
const utils = require('util');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: '',
      database: 'movies_db'
    },
    console.log(`Connected to the movies_db database.`)
  );

db.query = utils.promisfy(db.query);


//View all departments
//SELECT * FROM department;

//View all roles
//SELECT * FROM role;

// View all employees
// SELECT * FROM employees;

// Create new departments

// prompt the user for the name of the department 

    //THEN Run the query 
    //INSERT INTO department (name)
    // VALUES ('sales');

        //THEN ask the user what they want to do next 

// Create a new role
function createRole () {}
// Get the existing department from the department table

    // THEN prompt the user for "title", "Salary" and "department" for the role

        //Then Run Query
        //INSERT INTO role (title, salary, department_id)
        //VALUES ("Manager", 50000, 1)

            //THEN ask the user what they want to do next 