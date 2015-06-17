angular.module('bodeaApp')
    .controller('CommandesCtrl', function ($scope) {
    $scope.commandes = [
        {
            id: 1,
            store: 'magasin1',
            date: '10/11/11',
            state: 1
        },
        {
            id: 3,
            store: 'magasin2',
            date: '10/11/11',
            state: 2
        },
        {
            id: 2,
            store: 'magasin2',
            date: '10/11/11',
            state: 2
        }
    ];
    $scope.predicate = 'date';
    $scope.reverse = false;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.remove = function (index) {
        $scope.commandes.splice(index, 1)
    }


    });