INSERT INTO department (name)
VALUES ("Sales"),
       ("Marketing"),
       ("Engineering"),
       ("IT"),
       ("Administration");

INSERT INTO role (title, salary, department_id)
values ("District Manager", 90000, 1),
       ("Digital Marketing", 80000, 2),
       ("Project Manager", 100000, 3),
       ("Engineer", 90000, 4),
       ("Customer Service", 60000, 5);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Scooby", "Doo", 1, null),
       ("Daphney", "Duck", 1, 1),
       ("Lance", "Armstrong", 2, null),
       ("Hans", "Grober", 3, 5),
       ("John", "McClain", 3, null);
       