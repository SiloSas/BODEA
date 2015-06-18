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
                        brand: {name: 'aaaa'},
                        stores: [1, 2, 4],
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