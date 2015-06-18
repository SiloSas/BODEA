angular.module('bodeaApp').factory('UsersFactory', function ($q, $http) {
    var factory = {
        users: false,
        getUsers:  function () {
            var deferred = $q.defer();
            if (factory.users != false) {
                deferred.resolve(factory.users)
            } else {
                factory.users = [
                    {
                        id: 0,
                        name: 'aa',
                        firstName: 'aaa',
                        mail: 'aa.aaa@aaa.aa',
                        password: 'aaaaa',
                        function: 'aaaa',
                        countType: 1,
                        brand: {name: 'enseigne1'},
                        stores: [{
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

                        }],
                        isActive: true
                    }
                ];
                deferred.resolve(factory.users);
            }
            return deferred.promise;
        }
    };
    return factory;
});