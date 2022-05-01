DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;
USE company_db;


CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department VARCHAR(30) NOT NULL
);


CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  department_id INT,
  salary DECIMAL(9,2) NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);


CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);














SELECT id, firstName, lastName FROM employees WHERE manager_id IS NULL;



SELECT * FROM employees WHERE manager_id IS NOT NULL;


SELECT e.id, e.firstName, e.lastName, r.title, d.department, r.salary, e.manager_id FROM employees e LEFT JOIN employees em ON em.manager_id = em.id LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN departments d ON r.department_id = d.id