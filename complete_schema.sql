


CREATE DATABASE IF NOT EXISTS school_db;
USE school_db;

DROP TABLE IF EXISTS students;


CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
    name VARCHAR(100),
    course VARCHAR(50),
    year INT,
    is_active TINYINT(1) DEFAULT 1
);


CREATE INDEX idx_is_active ON students(is_active);


INSERT INTO students (name, course, year, is_active) VALUES
("Erhyl", "BSIT", 2, 1),
("Jake", "BSIT", 1, 1),
("Rod", "BSIT", 1, 1);

--reset the table values including the id
TRUNCATE TABLE students;