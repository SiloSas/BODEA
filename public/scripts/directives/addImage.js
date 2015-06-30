angular.module('bodeaApp').directive('addImageForm', function () {
    return {
        restrict: 'E',
        templateUrl: 'assets/views/addImageForm.html',
        controller: 'ImagesCtrl'
    }
});