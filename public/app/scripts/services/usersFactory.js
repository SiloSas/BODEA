angular.module('bodeaApp').factory('UsersFactory', function ($q, $http) {
    var factory = {
        users: false,
        getUsers:  function () {
            var deferred = $q.defer();
            if (factory.users != false) {
                deferred.resolve(factory.users)
            } else {
                $http.get('scripts/object.json').success(function (users) {
                    factory.users = users;
                    deferred.resolve(factory.users);
                })
            }
            return deferred.promise;
        }
    };
    return factory;
});