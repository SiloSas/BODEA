# --- !Ups
CREATE TABLE users (
  userId          SERIAL PRIMARY KEY,
  login           VARCHAR(255) NOT NULL,
  password        VARCHAR(255) NOT NULL,
  UNIQUE(login)
);

CREATE TABLE areas (
  areaId          SERIAL PRIMARY KEY,
  area            TEXT NOT NULL
);

CREATE TABLE brands (
  brandId         SERIAL PRIMARY KEY,
  brand           TEXT NOT NULL
);

CREATE TABLE stores (
  storeId          SERIAL PRIMARY KEY,
  store            TEXT NOT NULL
);

CREATE TABLE orders (
  orderId          SERIAL PRIMARY KEY,
  order            TEXT NOT NULL
);


CREATE TABLE images (
  imageId          SERIAL PRIMARY KEY,
  image            TEXT NOT NULL
);


# --- !Downs
DROP TABLE IF EXISTS users, areas, brands, stores, orders, images;