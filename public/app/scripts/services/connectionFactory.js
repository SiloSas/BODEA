angular.module('bodeaApp').factory('ConnectionFactory', function ($q, $http, $rootScope) {
    $rootScope.connected = false;
    var factory = {
        connect: function (user) {
            $http.post('/users/authenticate/'+ user.username + '/'+ user.password).success(function (user) {
                $rootScope.connected = 'admin';
            })
        }
    };
    return factory;
});