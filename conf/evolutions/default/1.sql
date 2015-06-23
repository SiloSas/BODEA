# --- !Ups
CREATE TABLE users (
  userId          SERIAL PRIMARY KEY,
  uuid            UUID NOT NULL,
  login           VARCHAR(255) NOT NULL,
  password        VARCHAR(255) NOT NULL,
  role            INT NOT NULL,
  object          TEXT,
  UNIQUE(login)
);
INSERT INTO users(uuid, login, password, role)
  VALUES ('2bcfb180-c24c-420f-af62-0ca26a2f85bd', 'admin', '$2a$10$l9Pp4kERl8gqM3XxaB1lOubuRNkysJVUO.x2EaUuoLj4jQHxcIey6', 1);

CREATE TABLE areas (
  areaId          SERIAL PRIMARY KEY,
  uuid            UUID NOT NULL,
  object          TEXT NOT NULL
);

CREATE TABLE brands (
  brandId         SERIAL PRIMARY KEY,
  uuid            UUID NOT NULL,
  object          TEXT NOT NULL
);

CREATE TABLE stores (
  storeId          SERIAL PRIMARY KEY,
  uuid             UUID NOT NULL,
  object           TEXT NOT NULL
);

CREATE TABLE images (
  imageId          SERIAL PRIMARY KEY,
  uuid             UUID NOT NULL,
  object           TEXT NOT NULL
);

CREATE TABLE orders (
  orderId          SERIAL PRIMARY KEY,
  uuid             UUID NOT NULL,
  object           TEXT NOT NULL
);


# --- !Downs
DROP TABLE IF EXISTS users, areas, brands, stores, images, orders;