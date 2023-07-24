INSERT INTO department (department_name)
VALUES
  ('Finance'),
  ('Sales'),
  ('Engineering'),
  ('Legal');

  INSERT INTO role (title, salary, department_id)
  VALUES
    ('Accountant', 160000, 1),
    ('Accountant Manager', 160000, 1),
    ('Software Engineer', 120000, 3),
    ('Lead Engineer', 150000, 3),
    ('Sales Lead', 100000, 2),
    ('Salesperson', 80000, 2),
    ('Lawyer', 400000, 4),
    ('Legal Team Lead', 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id )
VALUES
  ('John', 'Doe', 5, 0),
  ('Mike', 'Chan', 6, 1),
  ('Ashley', 'Rodrigues', 4, 0),
  ('Kevin', 'Tupik', 3, 3),
  ('Kunal', 'Singh', 2, 0),
  ('Malia', 'Brown', 4, 1),
  ('Sarah', 'Lourd', 8, 0),
  ('Tom', 'Allen', 7, 7);