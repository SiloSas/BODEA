angular.module('bodeaApp').controller('SettingsCtrl', function ($scope, UserFactory) {
    UserFactory.getUser().then(function (user) {
        $scope.user = user;
        $scope.user.newUser = angular.copy(user);
    });
    $scope.refactorUser = function () {
        UserFactory.refactorUser($scope.user)
    }
});