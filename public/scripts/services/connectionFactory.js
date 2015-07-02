angular.module('bodeaApp').factory('ConnectionFactory', function ($q, $http, $rootScope, $cookies, $location,
                                                                  MessagesFactory, OrdersFactory, UserFactory,
                                                                  UsersFactory, StoresFactory) {
    $rootScope.connected = false;
    var sessionCoockie = $cookies.get('PLAY_SESSION');
    if (angular.isDefined(sessionCoockie)) {
        var sessionType = sessionCoockie.substring((sessionCoockie.indexOf('&role=')+6)).replace('"', '');
        if (sessionType == 1) {
            $rootScope.connected = 'admin';
        } else if (sessionType == 2) {
            $rootScope.connected = 'client';
        }
    } else {
        $location.path('/')
    }
    var factory = {
        connect: function (user) {
            $http.get('/users/authenticate?login=' + user.login +'&password=' + user.password).
                success(function (role) {
                    if (role == 1) {
                        $rootScope.connected = 'admin';
                    } else if(role == 2) {
                        $rootScope.connected = 'client';
                    }
            }).error(function (error) {
                    MessagesFactory.displayMessage(error)
                })
        },
        disconnect: function () {
            $http.post('/users/logout').
                success(function () {
                    $rootScope.connected = false;
                    UserFactory.passToFalse();
                    UsersFactory.passToFalse();
                    OrdersFactory.passToFalse();
                    StoresFactory.passToFalse();
                    $location.path('/')
            })
        }
    };
    return factory;
});