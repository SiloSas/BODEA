angular.module('bodeaApp').factory('ConnectionFactory', function ($q, $http, $rootScope) {
    $rootScope.connected = false;
    var factory = {
        connect: function (user) {
            console.log(user)
            $http.get('/users/authenticate?login=' + user.login +'&password=' + user.password).
                success(function (user) {
                $rootScope.connected = 'admin';
            })
        }
    };
    return factory;
});