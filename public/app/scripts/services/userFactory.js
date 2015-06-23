angular.module('bodeaApp').factory('UserFactory', function ($q, $http) {
   var factory = {
       user: false,
       getUser: function () {
           var deferred = $q.defer();
           if (factory.user != false) {
               deferred.resolve(factory.user)
           } else {
               factory.user = {
                   "stores": [
                       {
                           "enginesNumber": 3,
                           "caneWidth": 211.5335,
                           "width": 283.1323,
                           "printFormat": "1.6341*4.9204",
                           "weight": 3.472,
                           "pipeSize": 2.6638,
                           "priceByM2": 16.3227,
                           "billingAddress": "5 Melrose Street, Bawcomville",
                           "deliveryAddress": "3 Tehama Street, Shawmut",
                           "phone": "90 15 53 38 22",
                           "area": {
                               "id": "55837ca1826923bbca6d514e",
                               "name": "Fruitdale"
                           },
                           "contactName": "Walters",
                           "brand": {
                               "id": "55837ca13e1532357ef8dbbd",
                               "name": "Entroflex"
                           },
                           "name": "Biohab",
                           "id": "55837ca1585ae4d1adaae937"
                       },
                       {
                           "enginesNumber": 5,
                           "caneWidth": 129.9247,
                           "width": 232.1402,
                           "printFormat": "2.0519*3.9289",
                           "weight": 2.1309,
                           "pipeSize": 1.8583,
                           "priceByM2": 19.3157,
                           "billingAddress": "10 Sedgwick Street, Lithium",
                           "deliveryAddress": "9 Atlantic Avenue, Crucible",
                           "phone": "94 14 46 28 28",
                           "area": {
                               "id": "55837ca1ce944bcd8e31615d",
                               "name": "Allison"
                           },
                           "contactName": "Walters",
                           "brand": {
                               "id": "55837ca13e1532357ef8dbbd",
                               "name": "Entroflex"
                           },
                           "name": "Netbook",
                           "id": "55837ca1a75cfba4e045a47b"
                       },
                       {
                           "enginesNumber": 4,
                           "caneWidth": 150.609,
                           "width": 278.2289,
                           "printFormat": "2.2042*3.5537",
                           "weight": 1.8005,
                           "pipeSize": 4.8354,
                           "priceByM2": 16.7863,
                           "billingAddress": "10 Visitation Place, Edgar",
                           "deliveryAddress": "2 Metrotech Courtr, Witmer",
                           "phone": "89 45 16 27 55",
                           "area": {
                               "id": "55837ca1ce2fac30dd70d026",
                               "name": "Silkworth"
                           },
                           "contactName": "Walters",
                           "brand": {
                               "id": "55837ca13e1532357ef8dbbd",
                               "name": "Entroflex"
                           },
                           "name": "Xelegyl",
                           "id": "55837ca1d8093efd1a539ece"
                       }
                   ],
                   "brand": {
                       "id": "55837ca13e1532357ef8dbbd",
                       "name": "Entroflex"
                   },
                   "orders": [
                       {
                           "image": {
                               "url": "images/caroussel1.gif",
                               "name": "image1"
                           },
                           "state": 0,
                           "date": "Mon May 15 2006 06:44:39 GMT+0000 (UTC)",
                           "price": 276.3894,
                           "weight": 2.386,
                           "numberItems": 9,
                           "subOrders": [
                               {
                                   "delivered": true,
                                   "weight": 14.0504,
                                   "price": 90.16,
                                   "deliveryDate": "Fri Jan 28 1972 17:08:38 GMT+0000 (UTC)",
                                   "numberItems": 46,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 13.343,
                                   "price": 10.9522,
                                   "deliveryDate": "Sun Mar 21 1982 13:52:25 GMT+0000 (UTC)",
                                   "numberItems": 31,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 7.1111,
                                   "price": 67.2,
                                   "deliveryDate": "Sun Dec 01 2002 13:35:29 GMT+0000 (UTC)",
                                   "numberItems": 36,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 12.9051,
                                   "price": 12.1814,
                                   "deliveryDate": "Thu Mar 01 1990 02:58:31 GMT+0000 (UTC)",
                                   "numberItems": 18,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 13.7621,
                                   "price": 76.7051,
                                   "deliveryDate": "Sat Jun 19 1982 03:17:01 GMT+0000 (UTC)",
                                   "numberItems": 11,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 2.2041,
                                   "price": 41.3267,
                                   "deliveryDate": "Thu Apr 25 1991 09:41:41 GMT+0000 (UTC)",
                                   "numberItems": 36,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 9.2391,
                                   "price": 38.782,
                                   "deliveryDate": "Fri Jul 14 2006 15:45:44 GMT+0000 (UTC)",
                                   "numberItems": 25,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 9.6094,
                                   "price": 99.6317,
                                   "deliveryDate": "Sat Oct 18 2014 15:00:16 GMT+0000 (UTC)",
                                   "numberItems": 21,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 12.3764,
                                   "price": 83.5999,
                                   "deliveryDate": "Sat Feb 19 1977 00:48:42 GMT+0000 (UTC)",
                                   "numberItems": 34,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 6.3859,
                                   "price": 51.5996,
                                   "deliveryDate": "Fri Mar 08 1991 07:01:42 GMT+0000 (UTC)",
                                   "numberItems": 15,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               }
                           ],
                           "brand": {
                               "id": "55837ca13e1532357ef8dbbd",
                               "name": "Entroflex"
                           },
                           "id": "DA7744836"
                       },
                       {
                           "image": {
                               "url": "images/caroussel1.gif",
                               "name": "image1"
                           },
                           "state": 5,
                           "date": "Thu Mar 18 1976 18:56:11 GMT+0000 (UTC)",
                           "price": 228.4167,
                           "weight": 5.8708,
                           "numberItems": 42,
                           "subOrders": [
                               {
                                   "delivered": false,
                                   "weight": 4.058,
                                   "price": 70.5514,
                                   "deliveryDate": "Sun May 18 2008 07:27:47 GMT+0000 (UTC)",
                                   "numberItems": 5,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 7.4299,
                                   "price": 11.9024,
                                   "deliveryDate": "Tue Jan 22 2013 20:48:34 GMT+0000 (UTC)",
                                   "numberItems": 32,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 5.2053,
                                   "price": 74.8901,
                                   "deliveryDate": "Tue Mar 16 2004 09:51:45 GMT+0000 (UTC)",
                                   "numberItems": 24,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 4.6778,
                                   "price": 69.6457,
                                   "deliveryDate": "Mon May 13 1985 23:21:35 GMT+0000 (UTC)",
                                   "numberItems": 15,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               }
                           ],
                           "brand": {
                               "id": "55837ca13e1532357ef8dbbd",
                               "name": "Entroflex"
                           },
                           "id": "DA1294844"
                       },
                       {
                           "image": {
                               "url": "images/caroussel1.gif",
                               "name": "image1"
                           },
                           "state": 4,
                           "date": "Mon Dec 05 1977 00:10:30 GMT+0000 (UTC)",
                           "price": 233.0716,
                           "weight": 13.937,
                           "numberItems": 48,
                           "subOrders": [
                               {
                                   "delivered": false,
                                   "weight": 8.7911,
                                   "price": 80.9303,
                                   "deliveryDate": "Sun Dec 15 1974 23:47:41 GMT+0000 (UTC)",
                                   "numberItems": 40,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 2.9231,
                                   "price": 10.0164,
                                   "deliveryDate": "Fri Oct 30 1992 07:41:32 GMT+0000 (UTC)",
                                   "numberItems": 44,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 13.8383,
                                   "price": 59.2744,
                                   "deliveryDate": "Sun Oct 01 1978 23:27:41 GMT+0000 (UTC)",
                                   "numberItems": 42,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 6.4424,
                                   "price": 55.346,
                                   "deliveryDate": "Sat Mar 14 2009 08:51:19 GMT+0000 (UTC)",
                                   "numberItems": 6,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               }
                           ],
                           "brand": {
                               "id": "55837ca13e1532357ef8dbbd",
                               "name": "Entroflex"
                           },
                           "id": "DA8102053"
                       },
                       {
                           "image": {
                               "url": "images/caroussel1.gif",
                               "name": "image1"
                           },
                           "state": 5,
                           "date": "Mon Jul 08 2002 06:44:47 GMT+0000 (UTC)",
                           "price": 107.698,
                           "weight": 13.3029,
                           "numberItems": 16,
                           "subOrders": [
                               {
                                   "delivered": true,
                                   "weight": 6.029,
                                   "price": 76.0722,
                                   "deliveryDate": "Tue Jan 10 1984 15:40:00 GMT+0000 (UTC)",
                                   "numberItems": 26,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 2.4102,
                                   "price": 72.1182,
                                   "deliveryDate": "Mon Oct 09 2000 04:57:46 GMT+0000 (UTC)",
                                   "numberItems": 18,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               }
                           ],
                           "brand": {
                               "id": "55837ca13e1532357ef8dbbd",
                               "name": "Entroflex"
                           },
                           "id": "DA6288558"
                       },
                       {
                           "image": {
                               "url": "images/caroussel1.gif",
                               "name": "image1"
                           },
                           "state": 1,
                           "date": "Tue Nov 03 1992 12:35:40 GMT+0000 (UTC)",
                           "price": 94.8514,
                           "weight": 6.3728,
                           "numberItems": 1,
                           "subOrders": [
                               {
                                   "delivered": true,
                                   "weight": 10.5244,
                                   "price": 27.8104,
                                   "deliveryDate": "Thu Apr 23 2009 01:55:07 GMT+0000 (UTC)",
                                   "numberItems": 17,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 6.7942,
                                   "price": 69.2055,
                                   "deliveryDate": "Tue May 07 1974 05:19:32 GMT+0000 (UTC)",
                                   "numberItems": 32,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 14.0478,
                                   "price": 87.6601,
                                   "deliveryDate": "Wed Jul 23 1997 01:51:53 GMT+0000 (UTC)",
                                   "numberItems": 24,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 2.3596,
                                   "price": 47.5728,
                                   "deliveryDate": "Sat Aug 07 1993 03:54:12 GMT+0000 (UTC)",
                                   "numberItems": 5,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 9.9229,
                                   "price": 44.2716,
                                   "deliveryDate": "Wed Jun 07 2000 02:50:27 GMT+0000 (UTC)",
                                   "numberItems": 24,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 2.9668,
                                   "price": 85.2001,
                                   "deliveryDate": "Tue Oct 17 1978 13:53:38 GMT+0000 (UTC)",
                                   "numberItems": 29,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 3.196,
                                   "price": 36.8046,
                                   "deliveryDate": "Tue Apr 03 1973 20:10:04 GMT+0000 (UTC)",
                                   "numberItems": 44,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": true,
                                   "weight": 12.8843,
                                   "price": 25.9668,
                                   "deliveryDate": "Fri Aug 26 2005 22:24:22 GMT+0000 (UTC)",
                                   "numberItems": 6,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               },
                               {
                                   "delivered": false,
                                   "weight": 10.7653,
                                   "price": 19.4337,
                                   "deliveryDate": "Tue Apr 18 1972 06:30:25 GMT+0000 (UTC)",
                                   "numberItems": 32,
                                   "store": {
                                       "enginesNumber": 5,
                                       "caneWidth": 129.9247,
                                       "width": 232.1402,
                                       "printFormat": "2.0519*3.9289",
                                       "weight": 2.1309,
                                       "pipeSize": 1.8583,
                                       "priceByM2": 19.3157,
                                       "billingAddress": "10 Sedgwick Street, Lithium",
                                       "deliveryAddress": "9 Atlantic Avenue, Crucible",
                                       "phone": "94 14 46 28 28",
                                       "area": {
                                           "id": "55837ca1ce944bcd8e31615d",
                                           "name": "Allison"
                                       },
                                       "contactName": "Walters",
                                       "brand": {
                                           "id": "55837ca13e1532357ef8dbbd",
                                           "name": "Entroflex"
                                       },
                                       "name": "Netbook",
                                       "id": "55837ca1a75cfba4e045a47b"
                                   }
                               }
                           ],
                           "brand": {
                               "id": "55837ca13e1532357ef8dbbd",
                               "name": "Entroflex"
                           },
                           "id": "DA645639"
                       }
                   ]
               };
               deferred.resolve(factory.user)
           }
           return deferred.promise;
       }
   };
   return factory;
});