angular.module('bodeaApp').config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('commandePalette', {
        '50': 'CC0D00',
        '100': 'E17D13',
        '200': 'FFFF4F',
        '300': '01579b',
        '400': '259b24',
        '500': 'f44336',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    })
    }).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('commandeTheme')
        .accentPalette('commandePalette', {
            'default': '50', // by default use shade 400 from the pink palette for primary intentions
            'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
            'hue-2': '200', // use shade 600 for the <code>md-hue-2</code> class
            'hue-3': '400'
        }); // specify primary color, all
    // other color intentions will be inherited
    // from default
}).controller('CommandesCtrl', function ($scope, $timeout, OrdersFactory, BrandFactory, StoresFactory, $log,
                                         $filter, AreaFactory) {
        $scope.orders = [];
        $scope.selectedStore = '';
        OrdersFactory.getOrders().then(function (orders) {
            $scope.orders = orders;
        });
        StoresFactory.getStores().then(function (stores) {
            $scope.stores = stores;
        });
    AreaFactory.getAreas().then(function (areas) {
        $scope.areas = areas.split(/, +/g).map( function (area) {
            return {
                value: area.toLowerCase(),
                name: area
            };
        })
    });
        $scope.limit = 20;
        $scope.getStoreById = function (id) {
            for (var i = 0; i < $scope.stores.length; i++) {
                if ($scope.stores[i].id == id) {
                    return $scope.stores[i];
                }
            }
        };
        $scope.copyCommande = function (order) {
            $timeout(function () {
                $scope.$apply(function () {
                    order.newOrder = angular.copy(order);
                })
            }, 0)
        };
        $scope.copyStore = function (store) {
            $timeout(function () {
                $scope.$apply(function () {
                    store.newStore = angular.copy(store);
                })
            }, 0)
        };
        $scope.removeCopyStore = function (store) {
            $timeout(function () {
                $scope.$apply(function () {
                    store.newOrder = {};
                })
            }, 0)
        };
        $scope.refactorStore = function (store) {
            $timeout(function () {
                $scope.$apply(function () {
                    for (var i = 0; i < $scope.stores.length; i++) {
                        if ($scope.stores[i].id == store.id) {
                            $scope.stores[i] = angular.copy(store.newStore);
                            store = angular.copy(store.newStore);
                        }
                    }
                })
            }, 0);
        };
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
        $scope.createNewStore = function (store) {
            $timeout(function () {
                $scope.$apply(function () {
                    store.newStore = {brand: $scope.newOrder.brand};
                })
            }, 0);
        };
        $scope.addNewStore = function (store) {
            $timeout(function () {
                $scope.$apply(function () {
                    store = angular.copy(store.newStore);
                    store.brand = $scope.newOrder.brand;
                    store.id = guid();
                    $scope.stores.push(store);
                    $scope.selectedStore = store.id;
                })
            });
        };

        $scope.refactorCommande = function (order) {
            $timeout(function () {
                $scope.$apply(function () {
                    order = angular.copy(order.newUser);
                })
            }, 0);
        };

        $scope.newOrder = {subOrders: [], state: 1};
        $scope.newSubOrder = {store: {}};
    $scope.cancelNewOrder = function () {
        $scope.newOrder = {subOrders: [], state: 1};
        $scope.newSubOrder = {store: {}};
        $scope.selectedStore = false;
    };
    function ordersTotalCalculs() {
        console.log($scope.newOrder.subOrders)
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
                        return subOrder;
                    })
                }, 0)
            }
        };
        $scope.addOrder = function () {
            $scope.newOrder.date = new Date();
            $scope.orders.push($scope.newOrder);
            $scope.newOrder = {subOrders: [], state: 1};
        };

        $scope.addImg = function () {
            //uploadImg
        };

        $scope.changeState = function (order) {
            var isDelivered = true;
            for (var i = 0; i < order.subOrders.length; i++) {
                if (order.subOrders[i].delivered == false) {
                    isDelivered = false
                }
            }
            $timeout(function () {
                $scope.$apply(function  () {
                    if (isDelivered == true) {
                        order.newOrder.state = 5;
                    } else {
                        order.newOrder.state = 4;
                    }
                })
            }, 0);
        };

        $scope.predicate = 'date';
        $scope.reverse = false;
        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        $scope.calculPriceAndWeight = function (subOrder) {
             subOrder.price =
                    subOrder.store.priceByM2 * (parseInt(subOrder.store.printFormat.split('*')[0]) *
                    parseInt(subOrder.store.printFormat.split('*')[1]))*subOrder.numberItems;
            subOrder.weight =
                    subOrder.store.weight*subOrder.numberItems;
            return subOrder
        };

        $scope.remove = function (order) {
            for (var i = 0; i < $scope.orders.length; i++) {
                if (order.id == $scope.orders[i].id) {
                    $scope.orders.splice(i, 1)
                }
            }
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
    $scope.querySearch  = querySearch;
    $scope.selectedItemChange = selectedItemChange;

    function querySearchBrand (query) {
        return query ? $scope.brands.filter( createFilterFor(query) ) : $scope.brands;
    }
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
    function selectedBrandChange(item) {
        var brandOrders = $filter('filter')($scope.orders, item.name, 'brand');
        var lastId = $filter('orderBy')(brandOrders, 'id', true)[0].id;
        $scope.newOrder.id = item.name.substring(0, 2) + (parseInt(lastId.replace(/[^0-9.]/g, ''))+1);
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