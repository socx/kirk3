  DROP DATABASE IF EXISTS `db_kirk3`;
  CREATE DATABASE `db_kirk3`;
  USE db_kirk3;
  DROP TABLE IF EXISTS `user`;
  create table user (
    id int(11) not null auto_increment primary key,
    fullname varchar(255) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    createdAt datetime default CURRENT_TIMESTAMP,
    updatedAt datetime
);

    --id binary(16) default (uuid_to_bin(uuid())) not null primary key,

INSERT INTO user (email, password, fullname) VALUES ('joe.bloggs@email.com', 'OpenSesame1!', 'Joe Blogs');
INSERT INTO user (email, password, fullname) VALUES ('jane.baggy@email.com', 'OpenSesame1!', 'Jane Baggy');
INSERT INTO user (email, password, fullname) VALUES ('peter.pan@email.com', 'OpenSesame1!', 'Peter Pan');
