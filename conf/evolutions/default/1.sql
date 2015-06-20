# --- !Ups
CREATE TABLE users (
  userId          SERIAL PRIMARY KEY,
  login           VARCHAR(255) NOT NULL,
  password        VARCHAR(255) NOT NULL
);

# --- !Downs
DROP TABLE IF EXISTS users;