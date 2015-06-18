angular.module('bodeaApp').factory('OrdersFactory', function ($q, $http) {
    var factory = {
        orders: false,
        getOrders: function () {
            var deferred = $q.defer();
            if (factory.orders != false) {
                deferred.resolve(factory.orders)
            } else {
                factory.orders = [
                    {
                        id: 1,
                        brand: 'enseigne1545',
                        subOrders: [
                            {
                                store: 'magasin2',
                                numberItems: 10,
                                deliveryAddress: 'rue fuse',
                                deliveryDate: new Date(),
                                price: 10,
                                weight: 4.3,
                                delivered: true
                            },
                            {
                                store: 'magasin2',
                                numberItems: 10,
                                deliveryAddress: 'rue fuse',
                                deliveryDate: new Date(),
                                price: 10,
                                weight: 4.3,
                                delivered: true
                            }
                        ],
                        numberItems: 20,
                        weight: 8.6,
                        price: 20,
                        date: '10/11/11',
                        state: 5,
                        image : {name: 'image1', url: 'images/caroussel1.gif'}
                    },
                    {
                        id: 3,
                        brand: 'enseigne2',
                        subOrders: [{
                            store: 'magasin2',
                            numberItems: 10,
                            deliveryAddress: 'rue fuse',
                            deliveryDate: new Date(),
                            price: 10,
                            weight: 4.3,
                            delivered: true
                        },
                            {
                                store: 'magasin2',
                                numberItems: 10,
                                deliveryAddress: 'rue fuse',
                                price: 10,
                                weight: 4.3,
                                delivered: false
                            }],
                        numberItems: 20,
                        weight: 8.6,
                        price: 20,
                        date: '10/11/11',
                        state: 4,
                        image : {name: 'image1', url: 'images/caroussel1.gif'}
                    },
                    {
                        id: 2,
                        brand: 'enseigne1',
                        subOrders: [
                            {
                                store: 'magasin2',
                                numberItems: 10,
                                deliveryAddress: 'rue fuse',
                                deliveryDate: new Date(),
                                price: 10,
                                weight: 4.3,
                                delivered: false
                            },
                            {
                                store: 'magasin2',
                                numberItems: 10,
                                deliveryAddress: 'rue fuse',
                                deliveryDate: new Date(),
                                price: 10,
                                weight: 4.3,
                                delivered: false
                            }
                        ],
                        numberItems: 20,
                        weight: 8.6,
                        price: 20,
                        date: '10/11/11',
                        state: 2,
                        image : {name: 'image1', url: 'images/caroussel1.gif'}
                    }
                ];
                deferred.resolve(factory.orders)
            }
            return deferred.promise
        }
    };
    return factory;
});