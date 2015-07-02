angular.module('bodeaApp').controller('HistoriqueCtrl', function ($scope, OrdersFactory, $filter, BrandFactory,
                                                                  StoresFactory, UserFactory, $rootScope) {
    $scope.weeks = 8;
    $scope.labels = [];
    $scope.filterChart = '';
    $scope.filterType = '';
    $scope.series = ['Ventes totals'];

    $scope.data = [
        []
    ];
    UserFactory.getUser().then(function (user) {
        $rootScope.user = user;
    });
    var endDate = new Date();
    var WEEKINMS = 604800000;
    var startDate = endDate - WEEKINMS;
    var newLabel = $filter('date')(startDate, 'MM/dd/yyyy') + ' - ' + $filter('date')(endDate, 'MM/dd/yyyy');
    $scope.initChart = function () {
        $scope.labels = [];
        $scope.data = [
            []
        ];
        for (var i = 0; i < $scope.weeks; i++) {
            endDate = new Date() - (WEEKINMS * i);
            startDate = endDate - WEEKINMS;
            newLabel = $filter('date')(startDate, 'MM/dd/yyyy') + ' - ' + $filter('date')(endDate, 'MM/dd/yyyy');
            $scope.labels.push(newLabel);
            var dataValue = 0;
            var filtredOrders = $filter('filter')($scope.orders, $scope.filterChart, $scope.filterType);
            if ($scope.filterType == 'brand') {
                StoresFactory.getStores().then(function (stores) {
                    $scope.stores = stores;
                    $scope.stores = $filter('filter')($scope.stores, $scope.filterChart, 'brand')
                })
            } else {
                StoresFactory.getStores().then(function (stores) {
                    $scope.stores = stores;
                })
            }
            var ordersLength = filtredOrders.length;
            for (var j = 0; j < ordersLength; j++){
                if (new Date(filtredOrders[j].date) > startDate && new Date(filtredOrders[j].date) <= endDate) {
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
    });
    BrandFactory.getBrands().then(function (brands) {
        $scope.brands = brands;
    });
    StoresFactory.getStores().then(function (stores) {
        $scope.stores = stores;
    })
});