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