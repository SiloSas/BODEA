# --- !Ups
CREATE TABLE users (
  userId          SERIAL PRIMARY KEY,
  uuid            UUID NOT NULL,
  login           VARCHAR(255) NOT NULL,
  password        VARCHAR(255) NOT NULL,
  role            INT NOT NULL,
  object          TEXT,
  isActive        BOOLEAN DEFAULT TRUE NOT NULL,
  UNIQUE(login)
);
INSERT INTO users(uuid, login, password, role)
  VALUES ('2bcfb180-c24c-420f-af62-0ca26a2f85bd', 'admin', '$2a$10$l9Pp4kERl8gqM3XxaB1lOubuRNkysJVUO.x2EaUuoLj4jQHxcIey6', 1);

INSERT INTO users(uuid, login, password, role)
  VALUES ('2bcfb184-c24c-420f-af62-0ca26a2f85bd', 'client', '$2a$10$l9Pp4kERl8gqM3XxaB1lOubuRNkysJVUO.x2EaUuoLj4jQHxcIey6', 2);

CREATE TABLE areas (
  areaId          SERIAL PRIMARY KEY,
  uuid            UUID NOT NULL,
  object          TEXT NOT NULL,
  UNIQUE(object)
);
INSERT INTO areas(uuid, object)
    VALUES ('8c43ba20-e056-1c28-46e8-ef6f4f333bc9','{"value":"ain","name":"Ain","id":"8c43ba20-e056-1c28-46e8-ef6f4f333bc9"}');
INSERT INTO areas(uuid, object)
    VALUES ('bc28d9a2-035f-a8b2-2969-af876166ee1e','{"value":"aisne","name":"Aisne","id":"bc28d9a2-035f-a8b2-2969-af876166ee1e"}');
INSERT INTO areas(uuid, object)
    VALUES  ('9fafb8b4-c146-62e4-0b24-bcad6366cdbc','{"value":"allier","name":"Allier","id":"9fafb8b4-c146-62e4-0b24-bcad6366cdbc"}');
INSERT INTO areas(uuid, object)
    VALUES  ('ea209259-78a7-aa05-8d57-b4288012254c','{"value":"alpes-de-haute-provence","name":"Alpes-de-Haute-Provence","id":"ea209259-78a7-aa05-8d57-b4288012254c"}');
INSERT INTO areas(uuid, object)
    VALUES  ('f1e4523a-7378-842f-c5f6-781173c47740','{"value":"alpes-maritimes","name":"Alpes-Maritimes","id":"f1e4523a-7378-842f-c5f6-781173c47740"}');
INSERT INTO areas(uuid, object)
    VALUES  ('dd59930c-b40d-140a-89d5-7d0955c9f4c4','{"value":"ardèche","name":"Ardèche","id":"dd59930c-b40d-140a-89d5-7d0955c9f4c4"}');
INSERT INTO areas(uuid, object)
    VALUES  ('dbd1dd24-19f1-4865-c089-44c872e8e29c','{"value":"ardennes,ariège","name":"Ardennes,Ariège","id":"dbd1dd24-19f1-4865-c089-44c872e8e29c"}');
INSERT INTO areas(uuid, object)
    VALUES  ('26a4b0d0-e401-6f12-e476-8d42fd36b810','{"value":"aube","name":"Aube","id":"26a4b0d0-e401-6f12-e476-8d42fd36b810"}');
INSERT INTO areas(uuid, object)
    VALUES  ('bc89ab81-2b4c-91d7-804b-ca596b89e289','{"value":"aude","name":"Aude","id":"bc89ab81-2b4c-91d7-804b-ca596b89e289"}');
INSERT INTO areas(uuid, object)
    VALUES  ('ea736dbc-cf48-df20-d8c6-867646572860','{"value":"aveyron","name":"Aveyron","id":"ea736dbc-cf48-df20-d8c6-867646572860"}');
INSERT INTO areas(uuid, object)
    VALUES  ('ac9a5147-85fe-1d80-d1dd-a3137de629b1','{"value":"bas-rhin","name":"Bas-Rhin","id":"ac9a5147-85fe-1d80-d1dd-a3137de629b1"}');
INSERT INTO areas(uuid, object)
    VALUES  ('72b1b986-7b21-2138-b7f0-b2431d642a03','{"value":"bouches-du-rhône","name":"Bouches-du-Rhône","id":"72b1b986-7b21-2138-b7f0-b2431d642a03"}');
INSERT INTO areas(uuid, object)
    VALUES  ('e760b6ce-202b-c6c5-4f7f-1941b5cd3308','{"value":"calvados","name":"Calvados","id":"e760b6ce-202b-c6c5-4f7f-1941b5cd3308"}');
INSERT INTO areas(uuid, object)
    VALUES  ('4f74e9e2-60f7-747a-8319-4ac93c6f6645','{"value":"cantal","name":"Cantal","id":"4f74e9e2-60f7-747a-8319-4ac93c6f6645"}');
INSERT INTO areas(uuid, object)
    VALUES  ('e0469e36-fce7-00c8-4b84-8aef217857c9','{"value":"charente,charente-maritime","name":"Charente,Charente-Maritime","id":"e0469e36-fce7-00c8-4b84-8aef217857c9"}');
INSERT INTO areas(uuid, object)
    VALUES  ('b7932b50-aee1-b698-356c-aea4f12a4c17','{"value":"cher","name":"Cher","id":"b7932b50-aee1-b698-356c-aea4f12a4c17"}');
INSERT INTO areas(uuid, object)
    VALUES  ('3e3bf449-fe7c-847c-1b4b-60addfd85968','{"value":"corrèze","name":"Corrèze","id":"3e3bf449-fe7c-847c-1b4b-60addfd85968"}');
INSERT INTO areas(uuid, object)
    VALUES  ('1845643f-53bf-51a6-905e-d2da5d636c8c','{"value":"corse-du-sud","name":"Corse-du-Sud","id":"1845643f-53bf-51a6-905e-d2da5d636c8c"}');
INSERT INTO areas(uuid, object)
    VALUES  ('05d9f71b-9135-26c1-94e1-8957f657c92a','{"value":"côte-d''or","name":"Côte-d''Or","id":"05d9f71b-9135-26c1-94e1-8957f657c92a"}');
INSERT INTO areas(uuid, object)
    VALUES  ('2fd1e926-9f7b-68fe-bd04-6c9afa2ca4c8','{"value":"côtes-d''armor","name":"Côtes-d''Armor","id":"2fd1e926-9f7b-68fe-bd04-6c9afa2ca4c8"}');
INSERT INTO areas(uuid, object)
    VALUES  ('c2c32f1f-eee7-de38-0dc9-1f81d3396128','{"value":"creuse","name":"Creuse","id":"c2c32f1f-eee7-de38-0dc9-1f81d3396128"}');
INSERT INTO areas(uuid, object)
    VALUES  ('e94c2162-644b-a369-08b5-68bb24bf20e2','{"value":"deux-sèvres,dordogne","name":"Deux-Sèvres,Dordogne","id":"e94c2162-644b-a369-08b5-68bb24bf20e2"}');
INSERT INTO areas(uuid, object)
    VALUES  ('f738931b-db9d-73ee-20af-051782e07da6','{"value":"doubs","name":"Doubs","id":"f738931b-db9d-73ee-20af-051782e07da6"}');
INSERT INTO areas(uuid, object)
    VALUES  ('8555ab17-f290-c8f1-8049-4ca6769f8768','{"value":"drôme","name":"Drôme","id":"8555ab17-f290-c8f1-8049-4ca6769f8768"}');
INSERT INTO areas(uuid, object)
    VALUES  ('bf52c67c-65ea-fd27-8ccb-46df948ebc83','{"value":"essonne","name":"Essonne","id":"bf52c67c-65ea-fd27-8ccb-46df948ebc83"}');
INSERT INTO areas(uuid, object)
    VALUES  ('fb280f0c-0441-9e12-d8e7-88bef150b5fe','{"value":"eure","name":"Eure","id":"fb280f0c-0441-9e12-d8e7-88bef150b5fe"}');
INSERT INTO areas(uuid, object)
    VALUES  ('e9877413-5269-3f0d-bc42-01b427236382','{"value":"eure-et-loir","name":"Eure-et-Loir","id":"e9877413-5269-3f0d-bc42-01b427236382"}');
INSERT INTO areas(uuid, object)
    VALUES  ('58a0f020-0621-ea3e-9c53-1e1b7c9c3b50','{"value":"finistère","name":"Finistère","id":"58a0f020-0621-ea3e-9c53-1e1b7c9c3b50"}');
INSERT INTO areas(uuid, object)
    VALUES  ('7ea86c81-0846-cfee-6e8a-74802d69592b','{"value":"gard","name":"Gard","id":"7ea86c81-0846-cfee-6e8a-74802d69592b"}');
INSERT INTO areas(uuid, object)
    VALUES  ('1ef83718-44d5-e0ae-31b3-8aba85981d7a','{"value":"gers","name":"Gers","id":"1ef83718-44d5-e0ae-31b3-8aba85981d7a"}');
INSERT INTO areas(uuid, object)
    VALUES  ('2b2de372-f2dc-c11a-57fc-eb68aee4bebb','{"value":"gironde","name":"Gironde","id":"2b2de372-f2dc-c11a-57fc-eb68aee4bebb"}');
INSERT INTO areas(uuid, object)
    VALUES  ('4677059b-ddfd-9240-9492-eaf8ef6f7c56','{"value":"haut-rhin,haute-corse","name":"Haut-Rhin,Haute-Corse","id":"4677059b-ddfd-9240-9492-eaf8ef6f7c56"}');
INSERT INTO areas(uuid, object)
    VALUES  ('32d3aadf-73cd-ff18-4c2b-c2a8a924bb05','{"value":"haute-garonne","name":"Haute-Garonne","id":"32d3aadf-73cd-ff18-4c2b-c2a8a924bb05"}');
INSERT INTO areas(uuid, object)
    VALUES  ('e8aec237-bda5-d054-b044-8e889eee857a','{"value":"haute-loire","name":"Haute-Loire","id":"e8aec237-bda5-d054-b044-8e889eee857a"}');
INSERT INTO areas(uuid, object)
    VALUES  ('e2256e9e-fa1b-f808-083e-c2e144f20199','{"value":"haute-marne","name":"Haute-Marne","id":"e2256e9e-fa1b-f808-083e-c2e144f20199"}');
INSERT INTO areas(uuid, object)
    VALUES  ('98b662a4-647b-e9fd-d45a-1b0bdb2695c4','{"value":"haute-saône","name":"Haute-Saône","id":"98b662a4-647b-e9fd-d45a-1b0bdb2695c4"}');
INSERT INTO areas(uuid, object)
    VALUES  ('2e82b110-81ab-aa30-644c-0f7a1e0401fa','{"value":"haute-savoie","name":"Haute-Savoie","id":"2e82b110-81ab-aa30-644c-0f7a1e0401fa"}');
INSERT INTO areas(uuid, object)
    VALUES  ('3dae154f-d2ea-a268-72b6-3ae238ab2bad','{"value":"haute-vienne,hautes-alpes","name":"Haute-Vienne,Hautes-Alpes","id":"3dae154f-d2ea-a268-72b6-3ae238ab2bad"}');
INSERT INTO areas(uuid, object)
    VALUES  ('21ed6dda-d901-a2a6-8307-63c1c6faf6dd','{"value":"hautes-pyrénées","name":"Hautes-Pyrénées","id":"21ed6dda-d901-a2a6-8307-63c1c6faf6dd"}');
INSERT INTO areas(uuid, object)
    VALUES  ('b7b324d4-fda2-51bd-12fd-6d33e3234914','{"value":"hauts-de-seine","name":"Hauts-de-Seine","id":"b7b324d4-fda2-51bd-12fd-6d33e3234914"}');
INSERT INTO areas(uuid, object)
    VALUES  ('1d155121-ea2e-4a15-d373-61cbc16618bb','{"value":"hérault","name":"Hérault","id":"1d155121-ea2e-4a15-d373-61cbc16618bb"}');
INSERT INTO areas(uuid, object)
    VALUES  ('f78f803f-992d-429e-fe08-69c309ad936f','{"value":"ille-et-vilaine","name":"Ille-et-Vilaine","id":"f78f803f-992d-429e-fe08-69c309ad936f"}');
INSERT INTO areas(uuid, object)
    VALUES  ('b65b65a9-16c9-dc56-3738-46ae01f5e8b8','{"value":"indre","name":"Indre","id":"b65b65a9-16c9-dc56-3738-46ae01f5e8b8"}');
INSERT INTO areas(uuid, object)
    VALUES  ('4f9949c4-601e-952f-0ea3-0515f10d22fb','{"value":"indre-et-loire,isère","name":"Indre-et-Loire,Isère","id":"4f9949c4-601e-952f-0ea3-0515f10d22fb"}');
INSERT INTO areas(uuid, object)
    VALUES  ('ec2b4619-35b7-31eb-c3c1-f0a9d4785dc5','{"value":"jura","name":"Jura","id":"ec2b4619-35b7-31eb-c3c1-f0a9d4785dc5"}');
INSERT INTO areas(uuid, object)
    VALUES  ('631acaf8-21d3-7281-82bc-b4484ae78adb','{"value":"landes","name":"Landes","id":"631acaf8-21d3-7281-82bc-b4484ae78adb"}');
INSERT INTO areas(uuid, object)
    VALUES  ('a0b5b1f9-bb34-d94e-e704-9780588e0ab2','{"value":"loir-et-cher","name":"Loir-et-Cher","id":"a0b5b1f9-bb34-d94e-e704-9780588e0ab2"}');
INSERT INTO areas(uuid, object)
    VALUES  ('5cd93e2f-abbd-8a51-c40d-f1a39bf95d78','{"value":"loire","name":"Loire","id":"5cd93e2f-abbd-8a51-c40d-f1a39bf95d78"}');
INSERT INTO areas(uuid, object)
    VALUES  ('2479dbb5-efce-9af5-d53f-05b39f955197','{"value":"loire-atlantique","name":"Loire-Atlantique","id":"2479dbb5-efce-9af5-d53f-05b39f955197"}');
INSERT INTO areas(uuid, object)
    VALUES  ('84c91ad0-89e8-b910-0ad0-b84a6ec5a959','{"value":"loiret","name":"Loiret","id":"84c91ad0-89e8-b910-0ad0-b84a6ec5a959"}');
INSERT INTO areas(uuid, object)
    VALUES  ('38b79739-a018-83ea-d697-a32c5ff14c72','{"value":"lot","name":"Lot","id":"38b79739-a018-83ea-d697-a32c5ff14c72"}');
INSERT INTO areas(uuid, object)
    VALUES  ('1f6116b6-8ed6-ea33-bb35-2f34b3d9aa3a','{"value":"lot-et-garonne","name":"Lot-et-Garonne","id":"1f6116b6-8ed6-ea33-bb35-2f34b3d9aa3a"}');
INSERT INTO areas(uuid, object)
    VALUES  ('3266baa9-787b-9a34-9b7d-2822b5630d94','{"value":"lozère,maine-et-loire","name":"Lozère,Maine-et-Loire","id":"3266baa9-787b-9a34-9b7d-2822b5630d94"}');
INSERT INTO areas(uuid, object)
    VALUES  ('7f7f864e-2c97-97d5-87ca-be91ada9090b','{"value":"manche","name":"Manche","id":"7f7f864e-2c97-97d5-87ca-be91ada9090b"}');
INSERT INTO areas(uuid, object)
    VALUES  ('148117eb-8e9e-8278-06cc-d78d2e74e925','{"value":"marne","name":"Marne","id":"148117eb-8e9e-8278-06cc-d78d2e74e925"}');
INSERT INTO areas(uuid, object)
    VALUES  ('58ada87a-d8d1-7e27-1a68-eb65caa98b60','{"value":"mayenne","name":"Mayenne","id":"58ada87a-d8d1-7e27-1a68-eb65caa98b60"}');
INSERT INTO areas(uuid, object)
    VALUES  ('5b0186c6-261d-738a-6bc8-1fb95525bca0','{"value":"meurthe-et-moselle","name":"Meurthe-et-Moselle","id":"5b0186c6-261d-738a-6bc8-1fb95525bca0"}');
INSERT INTO areas(uuid, object)
    VALUES  ('e42c46cc-726e-52be-a11f-cc159b594e63','{"value":"meuse","name":"Meuse","id":"e42c46cc-726e-52be-a11f-cc159b594e63"}');
INSERT INTO areas(uuid, object)
    VALUES  ('eb479812-8476-588a-ebbd-11917329b673','{"value":"morbihan","name":"Morbihan","id":"eb479812-8476-588a-ebbd-11917329b673"}');
INSERT INTO areas(uuid, object)
    VALUES  ('f718ee81-0568-044e-2f01-799d3c646c6d','{"value":"moselle","name":"Moselle","id":"f718ee81-0568-044e-2f01-799d3c646c6d"}');
INSERT INTO areas(uuid, object)
    VALUES  ('7573073e-30f4-c2d6-496b-039415cbe036','{"value":"nièvre","name":"Nièvre","id":"7573073e-30f4-c2d6-496b-039415cbe036"}');
INSERT INTO areas(uuid, object)
    VALUES  ('21322d2b-339c-e175-ec78-a9962382fc84','{"value":"nord,oise","name":"Nord,Oise","id":"21322d2b-339c-e175-ec78-a9962382fc84"}');
INSERT INTO areas(uuid, object)
    VALUES  ('a27cfec0-2333-5800-d9af-7b676c25b7d9','{"value":"orne","name":"Orne","id":"a27cfec0-2333-5800-d9af-7b676c25b7d9"}');
INSERT INTO areas(uuid, object)
    VALUES  ('72fe0fb8-30b3-e33d-5f9b-b51e2131dae2','{"value":"paris","name":"Paris","id":"72fe0fb8-30b3-e33d-5f9b-b51e2131dae2"}');
INSERT INTO areas(uuid, object)
    VALUES  ('e23d206d-fb14-6383-d95d-ef5696c08858','{"value":"pas-de-calais","name":"Pas-de-Calais","id":"e23d206d-fb14-6383-d95d-ef5696c08858"}');
INSERT INTO areas(uuid, object)
    VALUES  ('cf492ce0-c147-82da-0ad8-dcd0c45b7dd9','{"value":"puy-de-dôme","name":"Puy-de-Dôme","id":"cf492ce0-c147-82da-0ad8-dcd0c45b7dd9"}');
INSERT INTO areas(uuid, object)
    VALUES  ('9f43e369-98ee-08d4-ed2b-ace7b681e0ff','{"value":"pyrénées-atlantiques","name":"Pyrénées-Atlantiques","id":"9f43e369-98ee-08d4-ed2b-ace7b681e0ff"}');
INSERT INTO areas(uuid, object)
    VALUES  ('99c7bb68-20fe-d4b3-5ffd-a73ad1541819','{"value":"pyrénées-orientales","name":"Pyrénées-Orientales","id":"99c7bb68-20fe-d4b3-5ffd-a73ad1541819"}');
INSERT INTO areas(uuid, object)
    VALUES  ('6a55f527-1e02-b44e-d5c5-ea40624f1864','{"value":"rhône,saône-et-loire","name":"Rhône,Saône-et-Loire","id":"6a55f527-1e02-b44e-d5c5-ea40624f1864"}');
INSERT INTO areas(uuid, object)
    VALUES  ('ee04646d-3651-986f-e8a3-b1f9cefe961a','{"value":"sarthe","name":"Sarthe","id":"ee04646d-3651-986f-e8a3-b1f9cefe961a"}');
INSERT INTO areas(uuid, object)
    VALUES  ('d41e822f-048d-a667-ab82-6ba301393a1b','{"value":"savoie","name":"Savoie","id":"d41e822f-048d-a667-ab82-6ba301393a1b"}');
INSERT INTO areas(uuid, object)
    VALUES  ('59f0551c-52c6-cc7e-68e9-0260621d171d','{"value":"seine-et-marne","name":"Seine-et-Marne","id":"59f0551c-52c6-cc7e-68e9-0260621d171d"}');
INSERT INTO areas(uuid, object)
    VALUES  ('f7741233-07fe-e826-2686-7172f595633b','{"value":"seine-maritime","name":"Seine-Maritime","id":"f7741233-07fe-e826-2686-7172f595633b"}');
INSERT INTO areas(uuid, object)
    VALUES  ('08eaebd9-afb1-24f0-af76-b2dd793b6a8f','{"value":"seine-saint-denis","name":"Seine-Saint-Denis","id":"08eaebd9-afb1-24f0-af76-b2dd793b6a8f"}');
INSERT INTO areas(uuid, object)
    VALUES  ('04ccf4f9-5a4f-ab57-823a-000f44467a18','{"value":"somme","name":"Somme","id":"04ccf4f9-5a4f-ab57-823a-000f44467a18"}');
INSERT INTO areas(uuid, object)
    VALUES  ('191879e7-9229-2527-c8f8-34c8953a0971','{"value":"tarn,tarn-et-garonne","name":"Tarn,Tarn-et-Garonne","id":"191879e7-9229-2527-c8f8-34c8953a0971"}');
INSERT INTO areas(uuid, object)
    VALUES  ('1d9c63a1-dd53-e712-729f-f9e4d780ddbf','{"value":"territoire de belfort","name":"Territoire de Belfort","id":"1d9c63a1-dd53-e712-729f-f9e4d780ddbf"}');
INSERT INTO areas(uuid, object)
    VALUES  ('bd5b7c1b-e9b2-38a0-550b-9c4e94e9dd1e','{"value":"val-d''oise","name":"Val-d''Oise","id":"bd5b7c1b-e9b2-38a0-550b-9c4e94e9dd1e"}');
INSERT INTO areas(uuid, object)
    VALUES  ('5fdb4eef-5f11-9505-804d-5815ba529377','{"value":"val-de-marne","name":"Val-de-Marne","id":"5fdb4eef-5f11-9505-804d-5815ba529377"}');
INSERT INTO areas(uuid, object)
    VALUES  ('1a64d78a-608e-8c50-44f0-65baa4e30786','{"value":"var","name":"Var","id":"1a64d78a-608e-8c50-44f0-65baa4e30786"}');
INSERT INTO areas(uuid, object)
    VALUES  ('0cf177a0-2a4f-e8db-fbbd-1945fee8fea3','{"value":"vaucluse","name":"Vaucluse","id":"0cf177a0-2a4f-e8db-fbbd-1945fee8fea3"}');
INSERT INTO areas(uuid, object)
    VALUES  ('422a301a-d960-b47b-6aa7-af693275dc88','{"value":"vendée","name":"Vendée","id":"422a301a-d960-b47b-6aa7-af693275dc88"}');
INSERT INTO areas(uuid, object)
    VALUES  ('0051857a-b682-1c94-f1ce-426007c68d57','{"value":"vienne,vosges","name":"Vienne,Vosges","id":"0051857a-b682-1c94-f1ce-426007c68d57"}');
INSERT INTO areas(uuid, object)
    VALUES  ('8785c008-d8b8-a3e4-ff97-49f8dee15f07','{"value":"yonne","name":"Yonne","id":"8785c008-d8b8-a3e4-ff97-49f8dee15f07"}');
INSERT INTO areas(uuid, object)
    VALUES  ('fc5337ce-93ef-fa0c-e1da-ec761cd62902','{"value":"yvelines","name":"Yvelines","id":"fc5337ce-93ef-fa0c-e1da-ec761cd62902"}');

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

CREATE TABLE storeUser (
  storeId          INT REFERENCES stores (storeId),
  userId           INT REFERENCES users (userId),
  PRIMARY KEY (storeId, userId)
);

CREATE TABLE storeBrand (
  storeId          INT REFERENCES stores (storeId),
  brandId          INT REFERENCES brands (brandId),
  PRIMARY KEY (storeId, brandId)
);

CREATE TABLE storeOrder (
  storeId          INT REFERENCES stores (storeId),
  orderId          INT REFERENCES orders (orderId)
);

CREATE TABLE storeArea (
  storeId          INT REFERENCES stores (storeId),
  areaId           INT REFERENCES areas (areaId),
  PRIMARY KEY (storeId, areaId)
);

CREATE TABLE userBrand (
  userId           INT REFERENCES users (userId),
  brandId          INT REFERENCES brands (brandId),
  PRIMARY KEY (userId, brandId)
);

CREATE TABLE userImage (
  userId           INT REFERENCES users (userId),
  imageId          INT REFERENCES images (imageId),
  PRIMARY KEY (userId, imageId)
);

CREATE TABLE orderImage (
  orderId          INT REFERENCES orders (orderId),
  imageId          INT REFERENCES images (imageId),
  PRIMARY KEY (orderId, imageId)
);


# --- !Downs
DROP TABLE IF EXISTS orderBrand, orderOrder, orderStore, storeUser, storeBrand, storeOrder, storeArea, userBrand,
userImage, orderImage, users, areas, brands, stores, images, orders;
