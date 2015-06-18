angular.module('bodeaApp').factory('StoresFactory', function ($q, $http) {
    var factory = {
        stores: false,
        getStores: function () {
            var deferred = $q.defer();
            if (factory.stores != false) {
                deferred.resolve(factory.stores)
            } else {
                factory.stores = [
                    {
                        id: 3,
                        name: 'magasin1',
                        brand: {name: 'enseigne1'},
                        contactName: 'Réferent1',
                        area: {name: 'region1'},
                        phone: '00.00.00.00.00',
                        deliveryAddress: 'rue fuse',
                        billingAddress: 'rue fuse',
                        priceByM2: 10,
                        pipeSize: 2.3,
                        weight: 5,
                        printFormat: '5*6',
                        width: 500,
                        caneWidth: 500,
                        enginesNumber: 2

                    },
                    {
                        id: 2,
                        name: 'magasin2',
                        brand: {name: 'enseigne2'},
                        contactName: 'Réferent2',
                        area: {name: 'region2'},
                        phone: '00.00.00.00.00',
                        deliveryAddress: 'rue fuse',
                        billingAddress: 'rue fuse',
                        priceByM2: 10,
                        pipeSize: 2.3,
                        weight: 5,
                        printFormat: '5*6',
                        width: 500,
                        caneWidth: 500,
                        enginesNumber: 2

                    },
                    {
                        id: 1,
                        name: 'magasin2',
                        brand: {name: 'enseigne1'},
                        contactName: 'Réferent2',
                        area: {name: 'region2'},
                        phone: '00.00.00.00.00',
                        deliveryAddress: 'rue fuse',
                        billingAddress: 'rue fuse',
                        priceByM2: 10,
                        pipeSize: 2.3,
                        weight: 5,
                        printFormat: '5*6',
                        width: 500,
                        caneWidth: 500,
                        enginesNumber: 2

                    }
                ];
                deferred.resolve(factory.stores)
            }
            return deferred.promise
        }
    };
    return factory;
});