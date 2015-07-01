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
                        if (user.user.objectString == "undefined") {
                            delete(user.user.objectString);
                        }
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
                if (user.user.uuid == factory.users[i].user.uuid) {
                    user = angular.copy(user.newUser);
                    factory.users[i] = user
                }
            }
        $http.put('users?uuid='+ user.user.uuid + '&login=' + user.user.login + '&password=' + user.user.password +
            '&role=' + user.user.role + '&objectString='+ JSON.stringify(user.user.objectString) +
            '&isActive=' + user.user.isActive);
        },
        deleteUser: function (user) {
            for (var i = 0; i < factory.users.length; i++) {
                if (user.user.uuid == factory.users[i].user.uuid) {
                    factory.users.splice(i, 1)
                }
            }
        $http.delete('models/' + user.user.uuid + '?table=users');
        },
        postUser: function (user) {
        user.uuid = GuidFactory();
        factory.users.push(user);
        $http.post('users?uuid='+user.uuid+'&password='+user.user.password+
            '&login='+user.user.login+'&role='+user.user.role+'&objectString=' +
            JSON.stringify(user.user.objectString) + 'isActive=' + user.user.isActive)
        }
    };
    return factory;
});