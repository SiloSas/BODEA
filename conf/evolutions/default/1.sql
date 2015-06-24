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

CREATE TABLE orderBrand (
  orderId          INT REFERENCES orders (orderId),
  brandId          INT REFERENCES brands (brandId),
  PRIMARY KEY (orderId, brandId)
);

CREATE TABLE orderOrder (
  orderId          INT REFERENCES orders (orderId),
  suborderId       INT REFERENCES orders (suborderId),
  PRIMARY KEY (orderId, suborderId)
);

CREATE TABLE orderStore (
  orderId          INT REFERENCES orders (orderId),
  storeId          INT REFERENCES stores (storeId),
  PRIMARY KEY (orderId, storeId)
);

CREATE TABLE storeUser (
  storeId          INT REFERENCES stores (storeId),
  userId           INT REFERENCES stores (userId),
  PRIMARY KEY (storeId, userId)
);

CREATE TABLE storeBrand (
  storeId          INT REFERENCES stores (storeId),
  brandId          INT REFERENCES brands (brandId),
  PRIMARY KEY (storeId, brandId)
);

CREATE TABLE storeOrder (
  storeId          INT REFERENCES stores (storeId),
  orderId          INT REFERENCES orders (orderId),
  PRIMARY KEY (storeId, orderId)
);

CREATE TABLE storeArea (
  storeId          INT REFERENCES stores (storeId),
  areaId           INT REFERENCES areas (areaId),
  PRIMARY KEY (storeId, areaId)
);

CREATE TABLE userBand (
  userId           INT REFERENCES stores (userId),
  brandId          INT REFERENCES brands (brandId),
  PRIMARY KEY (userId, brandId)
);

CREATE TABLE userImage (
  userId           INT REFERENCES users (userId),
  imageId          INT REFERENCES images (imageId),
  PRIMARY KEY (userId, imageId)
);


# --- !Downs
DROP TABLE IF orderBrand, orderOrder, orderStore, storeUser, storeBrand, storeOrder, storeArea, userBand, userImage,
users, areas, brands, stores, images, orders;