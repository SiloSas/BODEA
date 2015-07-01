angular.module('bodeaApp').controller('UsersCtrl', function ($scope, UsersFactory, $timeout, BrandFactory, $log,
                                                             StoresFactory, AreaFactory, $filter) {
    UsersFactory.getUsers().then(function (users) {
        $scope.users = users;
        console.log($scope.users)
    });
    StoresFactory.getStores().then(function (stores) {
        $scope.stores = stores;
    });
    BrandFactory.getBrands().then(function (brands) {
        $scope.brands = brands
    });
    AreaFactory.getAreas().then(function(areas) {
        $scope.areas = areas;
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
        return angular.copy(user);
    };

    $scope.refactorUser = function (user) {
        UsersFactory.refactorUser(user)
    };

    $scope.remove = function (user) {
        UsersFactory.deleteUser(user)
    };

    $scope.newUser = {user: {isActive: true}, stores: []};
    $scope.addUser = function () {
        $scope.newUser.user.objectString.stores = $scope.newUser.stores.map(function(store) {
            return store.id;
        });
        console.log($scope.newUser);
        UsersFactory.postUser($scope.newUser);
        $scope.newUser = {user: {isActive: true}, stores: []};
    };

    $scope.addNewStore = function (store) {
        $timeout(function () {
            $scope.$apply(function () {
                if (store.area.flag) {
                    delete(store.area.flag);
                    AreaFactory.postArea(store.area)
                }
                if (angular.isDefined($scope.newUser.brand.flag)) {
                    delete($scope.newUser.brand.flag);
                    $scope.newUser.brand = BrandFactory.postBrand($scope.newUser.brand)
                }
                store.brand = $scope.newUser.brand;
                StoresFactory.postStore(store);
            })
        });
    };

    $scope.querySearchBrand   = querySearchBrand;
    $scope.selectedBrandChange = selectedBrandChange;
    $scope.searchTextChange   = searchTextChange;
    $scope.querySearch  = querySearch;
    $scope.selectedItemChange = selectedItemChange;

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
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
        //$scope.stores[index].area = item;
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