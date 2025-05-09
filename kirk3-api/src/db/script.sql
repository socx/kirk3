  DROP TABLE IF EXISTS `user`;
  create table user (
    --id binary(16) default (uuid_to_bin(uuid())) not null primary key,
    id int default (uuid_to_bin(uuid())) not null primary key,
    email varchar(255) not null,
    password varchar(255) not null,
    fullname varchar(255) not null
);


INSERT INTO user (email, password, fullname) VALUES ('joe.bloggs@email.com', 'OpenSesame1!', 'Joe Blogs');
INSERT INTO user (email, password, fullname) VALUES ('jane.baggy@email.com', 'OpenSesame1!', 'Jane Baggy');
INSERT INTO user (email, password, fullname) VALUES ('peter.pan@email.com', 'OpenSesame1!', 'Peter Pan');
