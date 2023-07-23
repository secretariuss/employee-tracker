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

INSERT INTO employee (first_name, last_name, role_id)
VALUES
  ('John', 'Doe', 5),
  ('Mike', 'Chan', 1),
  ('Ashley', 'Rodrigues', 2),
  ('Kevin', 'Tupik', 3),
  ('Kunal', 'Singh', 4),
  ('Malia', 'Brown', 4),
  ('Sarah', 'Lourd', 4),
  ('Tom', 'Allen', 6);