angular.module('bodeaApp').factory('ConnectionFactory', function ($q, $http, $rootScope, $cookies, $location,
                                                                  MessagesFactory, OrdersFactory, UserFactory,
                                                                  UsersFactory, StoresFactory, NotificationsFactory) {
    $rootScope.connected = false;
    var sessionCoockie = $cookies.get('PLAY_SESSION');
    if (angular.isDefined(sessionCoockie)) {
        var sessionType = sessionCoockie.substring((sessionCoockie.indexOf('&role=')+6)).replace('"', '');
        if (sessionType == 1) {
            $rootScope.connected = 'admin';
        } else if (sessionType == 2) {
            $rootScope.connected = 'client';
        }
        NotificationsFactory.getNotifications();
        NotificationsFactory.subscribe();
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
                    NotificationsFactory.getNotifications();
                    NotificationsFactory.subscribe()
            }).error(function (error) {
                    MessagesFactory.displayMessage('Login ou mot de passe invalide')
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
                    NotificationsFactory.passToFalse();
                    $location.path('/')
            })
        },
        forgottenpassword: function (login) {
            $http.post('users/forgottenpassword?login=' + login).success(function () {
                MessagesFactory.displayMessage('Un email vous a été envoyé')
            }).error(function (error) {
                MessagesFactory.displayMessage('Une erreur s\'est produite')
            })
        }
    };
    return factory;
});