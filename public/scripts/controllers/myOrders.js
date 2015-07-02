angular.module('bodeaApp').controller('MyOrdersCtrl', function ($scope, $rootScope, UserFactory) {

    UserFactory.getUser().then(function (user) {
        $rootScope.user = user;
    });


});