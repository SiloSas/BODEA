angular.module('bodeaApp').factory('UsersFactory', function ($q, $http) {
    var factory = {
        users: false,
        getUsers:  function () {
            var deferred = $q.defer();
            if (factory.users != false) {
                deferred.resolve(factory.users)
            } else {
                $http.get('models?table=users').success(function (users) {
                    factory.users = users;
                    deferred.resolve(factory.users);
                })
            }
            return deferred.promise;
        },
        refactorUser: function (user) {
            for (var i = 0; i < factory.users.length; i++) {
                if (user.id == factory.users[i].id) {
                    user = angular.copy(user.newUser);
                    factory.users[i] = user
                }
            }
        $http.post('models/' + user.id + '?table=users&objectString=' + JSON.stringify(user))
        }
    };
    return factory;
});