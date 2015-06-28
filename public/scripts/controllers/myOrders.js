angular.module('bodeaApp').controller('MyOrdersCtrl', function ($scope, $rootScope, UserFactory, ImagesFactory) {

    UserFactory.getUser().then(function (user) {
        $rootScope.user = user;
    });

    ImagesFactory.getImages().then(function (images) {
        $scope.images = images;
    });

    /*$scope.addImg = function (image) {
        image.id = GuidFactory();
        ImagesFactory.postImage(image);
    };*/
    $scope.loadImg = function (id) {
        var imagesLength = $scope.images.length;
        for (var i = 0; i < imagesLength; i++) {
            if ($scope.images[i].id == id) {
                return $scope.images[i];
            }
        }
    };

});