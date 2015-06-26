angular.module('bodeaApp').controller('MagasinsCtrl', function ($scope, $timeout, $filter, $log, StoresFactory,
                                                                BrandFactory, AreaFactory) {

    StoresFactory.getStores().then(function (stores) {
        $scope.stores = stores;
    });
    BrandFactory.getBrands().then(function (brands) {
        $scope.brands = brands
    });

    AreaFactory.getAreas().then(function (areas) {
        $scope.areas = areas;
    });
    $scope.limit = 20;
    $scope.predicate = 'brand';
    $scope.reverse = false;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.copyStore = function (store) {
        return angular.copy(store);
    };

    $scope.refactorStore = function (store) {
        StoresFactory.refactorStore(store)
    };

    $scope.remove = function (store) {
        StoresFactory.deleteStore(store)
    };

    $scope.newStore = {};
    $scope.addStore = function () {
        if (angular.isDefined($scope.newStore.brand.flag)) {
            delete($scope.newStore.brand.flag);
            BrandFactory.postBrand($scope.newStore.brand)
        }
        if (angular.isDefined($scope.newStore.area.flag)) {
            console.log($scope.newStore)
            //delete($scope.newStore.area.flag);
            AreaFactory.postArea($scope.newStore.area)
        }
        StoresFactory.postStore($scope.newStore);
        $scope.newStore = {}
    };

    $scope.querySearchBrand   = querySearchBrand;
    $scope.querySearch  = querySearch;
    $scope.selectedBrandChange = selectedBrandChange;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange   = searchTextChange;

    function querySearchBrand (query) {
        if ($scope.brands.filter( createFilterFor(query)).length == 0) {
            $scope.brands.push({name: query, value: query.toLowerCase(), flag: true});
        }
        return query ? $scope.brands.filter( createFilterFor(query) ) : $scope.brands;
    }
    function querySearch (query) {
        if ($scope.areas.filter( createFilterFor(query)).length == 0) {
            $scope.areas.push({name: query, value: query.toLowerCase(), flag: true});
        }
        return query ? $scope.areas.filter( createFilterFor(query) ) : $scope.areas;
    }
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    function selectedBrandChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
        //$scope.stores[index].area = item;
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