angular.module('bodeaApp').controller('UsersCtrl', function ($scope, UsersFactory, $timeout, BrandFactory, $log,
                                                             StoresFactory) {
    UsersFactory.getUsers().then(function (users) {
        $scope.users = users
        console.log($scope.users)
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
        var idx = false;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == item.id) {
                list.splice(i, 1);
                idx = true
            }
        }
        if (idx == false) {
            list.push(item);
        }
    };
    $scope.exists = function (item, list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == item.id) {
                return true;
            }
        }
    };
    $scope.copyUser = function (user) {
        user.newUser = {stores: []};
        $timeout(function () {
            $scope.$apply(function () {
                user.newUser = angular.copy(user);
            })
        }, 0)
    };

    $scope.refactorUser = function (user) {
        UsersFactory.refactorUser(user)
    };

    $scope.changeActiveUser = function (user) {
        //poste change user.isActive
    };

    $scope.remove = function (user) {
        for (var i = 0; i < $scope.users.length; i++) {
            if (user.id == $scope.users[i].id) {
                $scope.users.splice(i, 1)
            }
        }
    };

    $scope.newUser = {isActive: true, stores: []};
    $scope.addUser = function () {
        console.log($scope.newUser);
        UsersFactory.postUser($scope.newUser)
        $scope.newUser = {isActive: true, stores: []};
    };

    BrandFactory.getBrands().then(function (brands) {
        $scope.brands = brands.map( function (brand) {
            return {
                value: brand.name.toLowerCase(),
                name: brand.name
            };
        })
    });

    $scope.querySearchBrand   = querySearchBrand;
    $scope.selectedBrandChange = selectedBrandChange;
    $scope.searchTextChange   = searchTextChange;

    function querySearchBrand (query) {
        if ($scope.brands.filter( createFilterFor(query)).length == 0) {
            $scope.brands.push({name: query, value: query.toLowerCase()});
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