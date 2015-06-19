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
    $scope.copyStore = function (store) {
        $timeout(function () {
            $scope.$apply(function () {
                store.newStore = angular.copy(store);
            })
        }, 0)
    };

    $scope.refactorStore = function (store) {
        store = store.newStore;
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
        $scope.brands = brands.map( function (brand) {
            return {
                value: brand.name.toLowerCase(),
                name: brand.name
            };
        });
    });

    AreaFactory.getAreas().then(function (areas) {
        $scope.areas = areas.split(/, +/g).map( function (area) {
            return {
                value: area.toLowerCase(),
                name: area
            };
        })
    });
    $scope.querySearchBrand   = querySearchBrand;
    $scope.querySearch  = querySearch;
    $scope.selectedBrandChange = selectedBrandChange;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange   = searchTextChange;

    function querySearchBrand (query) {
        if ($scope.brands.filter( createFilterFor(query)).length == 0) {
            $scope.brands.push({name: query, value: query.toLowerCase()});
        }
        return query ? $scope.brands.filter( createFilterFor(query) ) : $scope.brands;
    }
    function querySearch (query) {
        if ($scope.areas.filter( createFilterFor(query)).length == 0) {
            $scope.areas.push({name: query, value: query.toLowerCase()});
        }
        return query ? $scope.brands.filter( createFilterFor(query) ) : $scope.brands;
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