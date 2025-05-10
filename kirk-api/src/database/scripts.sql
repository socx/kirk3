-- Create Database
-- DROP DATABASE IF EXISTS `db_kirk3_123`;
-- CREATE DATABASE `db_kirk3_123`;

 USE db_kirk3_123;

-- Create Database User and Permissions 
CREATE USER 'kirk_user'@'localhost' IDENTIFIED BY 'N33d154yM0r3?';
GRANT CREATE, ALTER, DROP, INSERT, UPDATE, DELETE, SELECT, REFERENCES, RELOAD on *.* TO 'kirk_user'@'localhost' WITH GRANT OPTION;

-- Create Users Table
  DROP TABLE IF EXISTS `users`;
  CREATE TABLE users (
    id CHAR(36) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    activatedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME,
    PRIMARY KEY (id)
);

-- Create Permissions Table
  DROP TABLE IF EXISTS `permissions`;
  CREATE TABLE permissions (
    id CHAR(36) NOT NULL PRIMARY KEY,
    description VARCHAR(255) NOT NULL
);

--  Load default Permissions
INSERT INTO permissions (description) VALUES ('View Dashboard');
INSERT INTO permissions (description) VALUES ('View Finance');
INSERT INTO permissions (description) VALUES ('View Finance Bank Transactions');
INSERT INTO permissions (description) VALUES ('Edit Finance Bank Transactions');
INSERT INTO permissions (description) VALUES ('View Finance Expenses');
INSERT INTO permissions (description) VALUES ('Edit Finance Expenses');
INSERT INTO permissions (description) VALUES ('Approve Finance Expenses');
INSERT INTO permissions (description) VALUES ('Pay Finance Expenses');
INSERT INTO permissions (description) VALUES ('Delete Finance Expenses');
INSERT INTO permissions (description) VALUES ('Create Finance Bank Transaction Categories');
INSERT INTO permissions (description) VALUES ('Edit Finance Bank Transaction Categories');
INSERT INTO permissions (description) VALUES ('Delete Finance Bank Transaction Categories');
INSERT INTO permissions (description) VALUES ('View Finance Bank Transaction Categories');
INSERT INTO permissions (description) VALUES ('View Attendance');
INSERT INTO permissions (description) VALUES ('Edit Attendance');
INSERT INTO permissions (description) VALUES ('Delete Attendance');


-- Create user_permissions Table
DROP TABLE IF EXISTS `user_permissions`;
CREATE TABLE user_permissions (
  userid CHAR(36) NOT NULL,
  permissionid CHAR(36) NOT NULL,
  PRIMARY KEY (userid, permissionid)
);

-- Create finance_categories Table
DROP TABLE IF EXISTS `finance_categories`;
CREATE TABLE finance_categories (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  description VARCHAR(255) NOT NULL,
  code VARCHAR(10) NOT NULL,
  PRIMARY KEY (id)
);


-- Create expenses Table
DROP TABLE IF EXISTS `expense_items`;
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE expenses (
  expenseId CHAR(36) NOT NULL,
  description VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL,
  team VARCHAR(40) NOT NULL,
  totalAmount DOUBLE NOT NULL,
  claimant CHAR(36),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME,
  PRIMARY KEY (expenseId),
  FOREIGN KEY (claimant) REFERENCES users(id)
);


-- Create expense_items Table
CREATE TABLE expense_items (
  expenseItemId CHAR(36) NOT NULL,
  amount DOUBLE NOT NULL,
  description VARCHAR(255) NOT NULL,
  document VARCHAR(255) NOT NULL,
  expenseItemDate DATETIME,
  expenseId CHAR(36),
  PRIMARY KEY (expenseItemId),
  FOREIGN KEY (expenseId) REFERENCES expenses(expenseId)
);
