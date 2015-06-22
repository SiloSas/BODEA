angular.module('bodeaApp').controller('HistoriqueCtrl', function ($scope, OrdersFactory, $filter) {
    $scope.weeks = 8;
    $scope.labels = [];
    $scope.filter = '';
    $scope.series = ['Ventes totals'];

    $scope.data = [
        []
    ];
    var endDate = new Date();
    var WEEKINMS = 604800000;
    var startDate = endDate - WEEKINMS;
    var newLabel = $filter('date')(startDate, 'MM/dd/yyyy') + ' - ' + $filter('date')(endDate, 'MM/dd/yyyy');
    $scope.initChart = function () {
        for (var i = 0; i < $scope.weeks; i++) {
            endDate = new Date() - (WEEKINMS * i);
            startDate = endDate - WEEKINMS;
            newLabel = $filter('date')(startDate, 'MM/dd/yyyy') + ' - ' + $filter('date')(endDate, 'MM/dd/yyyy');
            $scope.labels.push(newLabel);
            var dataValue = 0;
            var filtredOrders = $filter('filter')($scope.orders, $scope.filter, 'brand');
            var ordersLength = filtredOrders.length;
            for (var j = 0; j < ordersLength; j++){
                if (filtredOrders[j].date > startDate && filtredOrders[j].date <= endDate) {
                    dataValue++
                }
            }
            $scope.data[0].push(angular.copy(dataValue));
            console.log($scope.data)
        }
    };
    OrdersFactory.getOrders().then(function (orders) {
        $scope.orders = orders;
        $scope.initChart()
    })
});