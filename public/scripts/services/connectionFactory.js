angular.module('bodeaApp').factory('ConnectionFactory', function ($q, $http, $rootScope, $cookies) {
    $rootScope.connected = false;
    var sessionCoockie = $cookies.get('PLAY_SESSION');
    if (angular.isDefined(sessionCoockie)) {
        var sessionType = sessionCoockie.substring((sessionCoockie.indexOf('&role=')+6)).replace('"', '');
        if (sessionType == 1) {
            $rootScope.connected = 'admin';
        } else if (sessionType == 2) {
            $rootScope.connected = 'client';
        }
    }
    var factory = {
        connect: function (user) {
            $http.get('/users/authenticate?login=' + user.login +'&password=' + user.password).
                success(function (user) {
                    if (user.role == 1) {
                        $rootScope.connected = 'admin';
                    } else if(user.role == 2) {
                        $rootScope.connected = 'client';
                    }
            })
        }
    };
    return factory;
});