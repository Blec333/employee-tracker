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
  salary VARCHAR(9) NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100),
  role_id INT,
  manager VARCHAR(30),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);
