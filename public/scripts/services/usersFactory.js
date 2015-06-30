angular.module('bodeaApp').factory('UsersFactory', function ($q, $http, GuidFactory) {
    var factory = {
        users: false,
        getUsers:  function () {
            var deferred = $q.defer();
            if (factory.users != false) {
                deferred.resolve(factory.users)
            } else {
                $http.get('models?table=users').success(function (users) {
                    factory.users = users.map(function(user) {
                        console.log(user)
                        if (angular.isDefined(user.user.objectString)) {
                            user.user.objectString = JSON.parse(user.user.objectString);
                        }
                        return user;
                    });
                    deferred.resolve(factory.users);
                })
            }
            return deferred.promise;
        },
        refactorUser: function (user) {
            for (var i = 0; i < factory.users.length; i++) {
                if (user.uuid == factory.users[i].uuid) {
                    user = angular.copy(user.newUser);
                    factory.users[i] = user
                }
            }
        $http.post('models/' + user.uuid + '?table=users&objectString=' + JSON.stringify(user.object))
        },
        postUser: function (user) {
        user.uuid = GuidFactory();
        factory.users.push(user);
        $http.post('users?uuid='+user.uuid+'&password='+user.user.password+
            '&login='+user.user.login+'&role='+user.user.role+'&objectString=' + JSON.stringify(user.user.objectString))
        }
    };
    return factory;
});