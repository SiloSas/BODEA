angular.module('bodeaApp').controller('MyOrdersCtrl', function ($scope, $rootScope, $timeout, UserFactory,
                                                                AreaFactory, $log, $filter, $mdToast, ImagesFactory,
                                                                GuidFactory) {

    UserFactory.getUser().then(function (user) {
        $rootScope.user = user;
        $scope.newOrder = {subOrders: [], state: 0, brand: user.brand};
        $scope.newSubOrder = {store: {}};
    });

    ImagesFactory.getImages().then(function (images) {
        $scope.images = images;
    });

    AreaFactory.getAreas().then(function (areas) {
        $scope.areas = areas.split(/, +/g).map( function (area) {
            return {
                value: area.toLowerCase(),
                name: area
            };
        })
    });
    $scope.addSubOrder = false;
    $scope.limit = 20;
    $scope.predicate = 'date';
    $scope.reverse = false;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    $scope.copyStore = function (store) {
        $timeout(function () {
            $scope.$apply(function () {
                store.newStore = angular.copy(store);
            })
        }, 0)
    };

    /*$scope.addImg = function (image) {
        image.id = GuidFactory();
        ImagesFactory.postImage(image);
    };*/
    $scope.loadImg = function (id) {
        var imagesLength = $scope.images.length;
        for (var i = 0; i < imagesLength; i++) {
            if ($scope.images[i].id == id) {
                return $scope.images[i];
            }
        }
    };
    $scope.copyOrder = function (order) {
        $timeout(function () {
            $scope.$apply(function () {
                order.newOrder = angular.copy(order);
            })
        }, 0)
    };

    $scope.removeCopyStore = function (store) {
        $timeout(function () {
            $scope.$apply(function () {
                store.newStore = {};
            })
        }, 0)
    };
    
    $scope.remove = function (order) {
        for (var i = 0; i < $rootScope.user.orders.length; i++) {
            if (order.id == $rootScope.user.orders[i].id) {
                $rootScope.user.orders.splice(i, 1)
            }
        }
    };

    $scope.refactorOrder = function (order) {
        $timeout(function () {
            $scope.$apply(function () {
                for (var i = 0; i < $rootScope.user.orders.length; i++) {
                    if ($rootScope.user.orders[i].id == order.id) {
                        $rootScope.user.orders[i] = angular.copy(order.newOrder);
                        order = angular.copy(order.newOrder);
                    }
                }
            })
        }, 0);
    };

    $scope.refactorStore = function (store) {
        $timeout(function () {
            $scope.$apply(function () {
                for (var i = 0; i < $rootScope.user.stores.length; i++) {
                    if ($rootScope.user.stores[i].id == store.id) {
                        $rootScope.user.stores[i] = angular.copy(store.newStore);
                        store = angular.copy(store.newStore);
                        store.newStore = {};
                    }
                }
            })
        }, 0);
    };
    $scope.addNewStore = function (store) {
        $timeout(function () {
            $scope.$apply(function () {
                store = angular.copy(store.newStore);
                store.brand = $scope.newOrder.brand;
                store.id = guid();
                $rootScope.user.stores.push(store);
                $scope.selectedStore = store.id;
            })
        });
    };
    
    $scope.calculPriceAndWeight = function (subOrder) {
        subOrder.price =
            subOrder.store.priceByM2 * (parseInt(subOrder.store.printFormat.split('*')[0]) *
            parseInt(subOrder.store.printFormat.split('*')[1]))*subOrder.numberItems;
        subOrder.weight =
            subOrder.store.weight*subOrder.numberItems;
        return subOrder
    };

    function ordersTotalCalculs() {
        var subOrdersLength = $scope.newOrder.subOrders.length;
        var newPrice = 0;
        var newWeight = 0;
        var newNumberItems = 0;
        for (var i = 0; i < subOrdersLength; i++) {
            newPrice = newPrice + $scope.newOrder.subOrders[i].price;
            newWeight = newWeight + $scope.newOrder.subOrders[i].weight;
            newNumberItems = newNumberItems + $scope.newOrder.subOrders[i].numberItems
        }
        $scope.newOrder.price = newPrice;
        $scope.newOrder.weight = newWeight;
        $scope.newOrder.numberItems = newNumberItems;
    }

    $scope.orderTotalCalculs = function (order) {
        var subOrdersLength = order.subOrders.length;
        var newPrice = 0;
        var newWeight = 0;
        var newNumberItems = 0;
        for (var i = 0; i < subOrdersLength; i++) {
            newPrice = newPrice + order.subOrders[i].price;
            newWeight = newWeight + order.subOrders[i].weight;
            newNumberItems = newNumberItems + order.subOrders[i].numberItems
        }
        order.price = newPrice;
        order.weight = newWeight;
        order.numberItems = newNumberItems;
        return order;
    };

    $scope.ordersTotalCalculs = function () {
        ordersTotalCalculs()
    };

    $scope.addNewSubOrder = function (subOrder) {
        if (subOrder != {store: {}}) {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.newOrder.subOrders.push(angular.copy(subOrder));
                    ordersTotalCalculs();
                    subOrder = {store: {}};
                    $scope.addSubOrder = false;
                    return subOrder;
                })
            }, 0)
        }
    };
    $scope.refactorNewSubOrder = function (subOrder, order) {
        if (subOrder != {store: {}}) {
            $timeout(function () {
                $scope.$apply(function () {
                    order.newOrder.subOrders.push(angular.copy(subOrder));
                    subOrder = {store: {}};
                    $scope.addSubOrder = false;
                    order.newOrder = $scope.orderTotalCalculs(order.newOrder);
                    return subOrder;
                })
            }, 0)
        }
    };

    $scope.changeOrderState = function (order) {
        //post refactor order
    };

    $scope.addOrder = function (order) {
        if (order.subOrders.length > 0) {
            $timeout(function () {
                $rootScope.$apply(function () {
                    $scope.createOrder = false;
                    var lastId = $filter('orderBy')($rootScope.user.orders, 'id', true)[0].id;
                    order.id = $rootScope.user.brand.name.substring(0, 2).toUpperCase() + (parseInt(lastId.replace(/[^0-9.]/g, '')) + 1);
                    order.date = new Date();
                    $rootScope.user.orders.push(order);
                    $scope.newOrder = {subOrders: [], state: 0};
                    $scope.newSubOrder = {store: {}};
                })
            }, 0)
        } else  {
            $scope.toastPosition = {
                bottom: false,
                top: true,
                left: false,
                right: true
            };
            $scope.getToastPosition = function() {
                return Object.keys($scope.toastPosition)
                    .filter(function(pos) { return $scope.toastPosition[pos]; })
                    .join(' ');
            };
            $mdToast.show(
                $mdToast.simple()
                    .content('Veuillez entrer au moins une sous commande')
                    .position($scope.getToastPosition())
                    .hideDelay(3000)
            );
        }
    };

    $scope.cancelNewOrder = function () {
        $timeout(function () {
            $rootScope.$apply(function () {
                $scope.newOrder = {subOrders: [], state: 0};
                $scope.newSubOrder = {store: {}};
            })
        }, 0)
    };

    $scope.getStoreById = function (id) {
        var storeLength = $rootScope.user.stores.length;
        for (var i = 0; i < storeLength; i++) {
            if ($rootScope.user.stores[i].id == id) {
                return $rootScope.user.stores[i];
            }
        }
    };

    $scope.searchTextChange   = searchTextChange;
    $scope.querySearch  = querySearch;
    $scope.selectedItemChange = selectedItemChange;
    function querySearch (query) {
        if ($scope.areas.filter( createFilterFor(query)).length == 0) {
            $scope.areas.push({name: query, value: query.toLowerCase()});
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
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(area) {
            return (area.value.indexOf(lowercaseQuery) === 0);
        };
    }

});