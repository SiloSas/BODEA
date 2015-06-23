angular.module('bodeaApp').controller('ImagesCtrl', function ($scope, ImagesFactory, GuidFactory, $timeout) {
    ImagesFactory.getImages().then(function (images) {
        $scope.images = images;
    });

    $scope.remove = function (image) {
        var imagesLength = $scope.images.length;
        for (var i = 0; i < imagesLength; i++) {
            if ($scope.images[i].id == image.id) {
                ImagesFactory.deleteImage(image.id);
                //delete image
            }
        }
    };

    $scope.newImage = {};
    $scope.addNewImage = function () {
        $scope.newImage.id = GuidFactory();
        ImagesFactory.postImage($scope.newImage);
        $scope.newImage = {};
    };

    $scope.refactorImage = function (image) {
        ImagesFactory.refactorImage(image);
    };

    $scope.copyImage = function (image) {
        $timeout(function () {
            $scope.$apply(function () {
                image.newImage = angular.copy(image);
            })
        })
    }
});