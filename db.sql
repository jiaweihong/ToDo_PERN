-- CREATE DATABASE todo_db;

CREATE TABLE account(
    account_id SERIAL PRIMARY KEY,
    username VARCHAR,
    email VARCHAR,
    password VARCHAR
);

CREATE TABLE todo(
    todo_id SERIAL PRIMARY KEY,
    account_id INT REFERENCES account(account_id),
    description VARCHAR
);