angular.module('bodeaApp').controller('MagasinsCtrl', function ($scope, $timeout, $filter, $log, StoresFactory,
                                                                BrandFactory, AreaFactory) {

    $scope.limit = 20;
    $scope.predicate = 'brand';
    $scope.reverse = false;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    StoresFactory.getStores().then(function (stores) {
        $scope.stores = stores;
    });
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
    };

    $scope.newStore = {};
    $scope.addStore = function () {
        $scope.stores.push($scope.newStore);
        $scope.newStore = {}
    };

    BrandFactory.getBrands().then(function (brands) {
        $scope.brands = brands.split(/, +/g).map( function (brand) {
            return {
                value: brand.toLowerCase(),
                name: brand
            };
        })
    });

    AreaFactory.getAreas().then(function (areas) {
        $scope.areas = areas.split(/, +/g).map( function (area) {
            return {
                value: area.toLowerCase(),
                name: area
            };
        })
    });
    $scope.querySearch   = querySearch;
    $scope.querySearchBrand   = querySearchBrand;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange   = searchTextChange;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
        console.log($scope.areas)
        if ($scope.areas.filter( createFilterFor(query)).length == 0) {
            $scope.areas.push({name: query, value: query});
        }
        return query ? $scope.areas.filter( createFilterFor(query) ) : $scope.areas;
    }
    function querySearchBrand (query) {
        console.log($scope.brands)
        if ($scope.brands.filter( createFilterFor(query)).length == 0) {
            $scope.brands.push({name: query, value: query});
        }
        return query ? $scope.brands.filter( createFilterFor(query) ) : $scope.brands;
    }
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
        //$scope.stores[index].area = item;
    }
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(area) {
            return (area.value.indexOf(lowercaseQuery) === 0);
        };
    }
});