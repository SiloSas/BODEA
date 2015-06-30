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
    })
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

    $scope.newUser = {isActive: true, stores: []};
    $scope.addUser = function () {
        console.log($scope.newUser);
        UsersFactory.postUser($scope.newUser);
        $scope.newUser = {isActive: true, stores: []};
    };

    $scope.addNewStore = function (store) {
        $timeout(function () {
            $scope.$apply(function () {
                if (store.area.flag) {
                    delete(store.area.flag);
                    AreaFactory.postArea(store.area)
                }
                if (angular.isDefined($scope.newOrder.brand.flag)) {
                    delete($scope.newOrder.brand.flag);
                    $scope.newOrder.brand = BrandFactory.postBrand($scope.newOrder.brand)
                }
                store.brand = $scope.newUser.brand;
                StoresFactory.postStore(store);
                $scope.stores.push(store)
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
        if (angular.isDefined(item)) {
            var brandOrders = $filter('filter')($scope.orders, item.name, 'brand');
            if (brandOrders.length > 0) {
                var lastId = $filter('orderBy')(brandOrders, 'id', true)[0].id;
                $scope.newOrder.id = item.name.substring(0, 2).toUpperCase() + (parseInt(lastId.replace(/[^0-9.]/g, '')) + 1);
            } else {
                $scope.newOrder.id = item.name.substring(0, 2).toUpperCase() + '1';
            }
        }
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