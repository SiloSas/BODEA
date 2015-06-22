# --- !Ups
CREATE TABLE users (
  userId          SERIAL PRIMARY KEY,
  uuid            UUID NOT NULL,
  login           VARCHAR(255) NOT NULL,
  password        VARCHAR(255) NOT NULL,
  UNIQUE(login)
);

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