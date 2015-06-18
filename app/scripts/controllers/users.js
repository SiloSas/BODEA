angular.module('bodeaApp').controller('UsersCtrl', function ($scope, UsersFactory, $timeout, BrandFactory, $log,
                                                             StoresFactory) {
    UsersFactory.getUsers().then(function (users) {
        $scope.users = users;
    });
    StoresFactory.getStores().then(function (stores) {
        $scope.stores = stores;
    });
    $scope.limit = 20;
    $scope.predicate = 'brand';
    $scope.reverse = false;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
    };
    $scope.exists = function (item, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == item.id) {
                return true;
            }
        }
    };
    $scope.copyUser = function (index) {
        $scope.users[index].newUser = {stores: []};
        $timeout(function () {
            $scope.$apply(function () {
                $scope.users[index].newUser = angular.copy($scope.users[index]);
            })
        }, 0)
    };

    $scope.refactorUser = function (index) {
        $scope.users[index] = $scope.users[index].newUser;
    };

    $scope.changeActiveUser = function (index) {
        //poste change user[index].isActive
    };

    $scope.remove = function (index) {
        $scope.users.splice(index, 1)
    };

    $scope.newUser = {isActive: true};
    $scope.newUser.stores = [];
    $scope.addUser = function () {
        $scope.users.push($scope.newUser);
        $scope.newUser = {}
    };

    BrandFactory.getBrands().then(function (brands) {
        $scope.brands = brands.split(/, +/g).map( function (brand) {
            return {
                value: brand.toLowerCase(),
                name: brand
            };
        })
    });

    $scope.querySearchBrand   = querySearchBrand;
    $scope.selectedBrandChange = selectedBrandChange;
    $scope.searchTextChange   = searchTextChange;
    function querySearchBrand (query) {
        if ($scope.brands.filter( createFilterFor(query)).length == 0) {
            $scope.brands.push({name: query, value: query});
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
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(area) {
            return (area.value.indexOf(lowercaseQuery) === 0);
        };
    }
});