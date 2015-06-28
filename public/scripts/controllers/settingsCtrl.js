angular.module('bodeaApp').controller('SettingsCtrl', function ($scope, UserFactory, StoresFactory) {
    UserFactory.getUser().then(function (user) {
        console.log(user)
        $scope.user = user;
    });
});