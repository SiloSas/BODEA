angular.module('bodeaApp').controller('MagasinsCtrl', function ($scope, $timeout) {
        $scope.stores = [
            {
                name: 'magasin1',
                brand: 'endseigne1',
                contactName: 'Réferent1',
                area: 'region1',
                phone: '00.00.00.00.00',
                deliveryAddress: 'rue fuse',
                billingAddress: 'rue fuse',
                priceByM2: 10,
                pipeSize: 2.3,
                weight: 5,
                printFormat: '5*6',
                width: 500,
                caneWidth: 500,
                enginesNumber: 2

            },
            {
                name: 'magasin2',
                brand: 'endseigne2',
                contactName: 'Réferent2',
                area: 'region2',
                phone: '00.00.00.00.00',
                deliveryAddress: 'rue fuse',
                billingAddress: 'rue fuse',
                priceByM2: 10,
                pipeSize: 2.3,
                weight: 5,
                printFormat: '5*6',
                width: 500,
                caneWidth: 500,
                enginesNumber: 2

            },
            {
                name: 'magasin2',
                brand: 'endseigne1',
                contactName: 'Réferent2',
                area: 'region2',
                phone: '00.00.00.00.00',
                deliveryAddress: 'rue fuse',
                billingAddress: 'rue fuse',
                priceByM2: 10,
                pipeSize: 2.3,
                weight: 5,
                printFormat: '5*6',
                width: 500,
                caneWidth: 500,
                enginesNumber: 2

            }
        ];
    $scope.limit = 20;
    $scope.predicate = 'brand';
    $scope.reverse = false;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    $scope.copyStore = function (index) {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.stores[index].newStore = angular.copy($scope.stores[index]);
            })
        }, 0)
    };

    $scope.refactorStore = function (index) {
        $scope.stores[index] = $scope.stores[index].newStore;
    };

    $scope.remove = function (index) {
        $scope.stores.splice(index, 1)
    }
});