angular.module('bodeaApp').controller('ImagesCtrl', function ($scope, ImagesFactory, UserFactory, $rootScope) {
    ImagesFactory.getImages().then(function (images) {
        $scope.images = images;
    });

    $scope.remove = function (image) {
        ImagesFactory.deleteImage(image);
    };
    UserFactory.getUser().then(function (user) {
        $rootScope.user = user;
    });

    $scope.newImage = {};
    $scope.addNewImage = function () {
        console.log($scope.newImage);
        ImagesFactory.postImage($scope.newImage);
        $scope.newImage = {};
    };

    $scope.refactorImage = function (image) {
        ImagesFactory.refactorImage(image);
    };

    $scope.copyImage = function (image) {
        image.newImage = angular.copy(image);
    }
});