DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;
USE company_db;


CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department VARCHAR(30) NOT NULL
);