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
                                         $filter, AreaFactory, $mdToast, ImagesFactory) {
        $scope.orders = [];
        $scope.selectedStore = '';
        OrdersFactory.getOrders().then(function (orders) {
            $scope.orders = orders;
        });
        StoresFactory.getStores().then(function (stores) {
            $scope.stores = stores;
        });
        AreaFactory.getAreas().then(function (areas) {
            $scope.areas = areas;
        });
        BrandFactory.getBrands().then(function (brands) {
            $scope.brands = brands
        });

        $scope.changeOrderState = function (order) {
            //post refactor order
        };
        ImagesFactory.getImages().then(function (images) {
            $scope.images = images;
        });

        $scope.loadImg = function (id) {
            var imagesLength = $scope.images.length;
            for (var i = 0; i < imagesLength; i++) {
                if ($scope.images[i].uuid == id) {
                    return $scope.images[i];
                }
            }
        };
        $scope.limit = 20;
        $scope.getStoreById = function (id) {
            for (var i = 0; i < $scope.stores.length; i++) {
                if ($scope.stores[i].id == id) {
                    return $scope.stores[i];
                }
            }
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

        $scope.selectAllStores = function (stores, list) {
            stores.map(function (item) {
                var idx = false;
                for (var i = 0; i < list.length; i++) {
                    if (list[i].id == item.id) {
                        idx = true
                    }
                }
                if (idx == false) {
                    list.push(item);
                }
            })
        };
        $scope.copyCommande = function (order) {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.newSubOrder = {stores: []};
                    order.newOrder = angular.copy(order);
                })
            }, 0)
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
                    store.brand = $scope.newOrder.brand;
                    StoresFactory.postStore(store);
                    $scope.stores.push(store)
                })
            });
        };

        $scope.refactorCommande = function (order) {
            console.log(order);
            OrdersFactory.refactorOrder(order)
        };

        $scope.newOrder = {subOrders: [], state: 1};
        $scope.newSubOrder = {stores: []};
        $scope.cancelNewOrder = function () {
            $scope.newOrder = {subOrders: [], state: 1};
            $scope.newSubOrder = {stores: []};
            $scope.selectedStore = false;
        };
        function ordersTotalCalculs(array) {
            var subOrdersLength;
            var newPrice = 0;
            var newWeight = 0;
            var newNumberItems = 0;
            if (angular.isDefined(array)) {
                subOrdersLength = array.subOrders.length;
                for (var j = 0; j < subOrdersLength; j++) {
                    newPrice = newPrice + array.subOrders[j].price;
                    newWeight = newWeight + array.subOrders[j].weight;
                    newNumberItems = newNumberItems + array.subOrders[j].numberItems
                }
                array.price = newPrice;
                array.weight = newWeight;
                array.numberItems = newNumberItems
            } else {
                subOrdersLength = $scope.newOrder.subOrders.length;
                for (var i = 0; i < subOrdersLength; i++) {
                    newPrice = newPrice + $scope.newOrder.subOrders[i].price;
                    newWeight = newWeight + $scope.newOrder.subOrders[i].weight;
                    newNumberItems = newNumberItems + $scope.newOrder.subOrders[i].numberItems
                }
                $scope.newOrder.price = newPrice;
                $scope.newOrder.weight = newWeight;
                $scope.newOrder.numberItems = newNumberItems
            }
        }
        $scope.ordersTotalCalculs = function (array) {
            console.log(array)
            ordersTotalCalculs(array)
        };

        $scope.addNewSubOrder = function (subOrder, array) {
            for (var i = 0; i < subOrder.stores.length; i++) {
                var subOrderToPush = {
                    numberItems: subOrder.numberItems,
                    store: subOrder.stores[i]
                };
                subOrderToPush = $scope.calculPriceAndWeight(subOrderToPush);
                if (angular.isDefined(array)) {
                    array.subOrders.push(angular.copy(subOrderToPush));
                } else {
                    $scope.newOrder.subOrders.push(angular.copy(subOrderToPush));
                }
            }

            ordersTotalCalculs(array);
            return {stores: []};
        };
        $scope.addOrder = function () {
            $scope.toastPosition = {
                bottom: false,
                top: true,
                left: false,
                right: true
            };
            $scope.getToastPosition = function () {
                return Object.keys($scope.toastPosition)
                    .filter(function (pos) {
                        return $scope.toastPosition[pos];
                    })
                    .join(' ');
            };
            if (angular.isDefined($scope.newOrder.image)) {
                if ($scope.newOrder.subOrders.length > 0) {
                    if (angular.isDefined($scope.newOrder.brand.flag)) {
                        delete($scope.newOrder.brand.flag);
                        BrandFactory.postBrand($scope.newOrder.brand)
                    }
                    if (angular.isDefined($scope.newOrder.id) === false) {
                        console.log($scope.newOrder.brand)
                        var brandOrders = $filter('filter')($scope.orders, $scope.newOrder.brand.name, 'brand');
                        if (brandOrders.length > 0) {
                            var lastId = $filter('orderBy')(brandOrders, 'id', true)[0].id;
                            $scope.newOrder.id = $scope.newOrder.brand.name.substring(0, 2).toUpperCase() + (parseInt(lastId.replace(/[^0-9.]/g, '')) + 1);
                        } else {
                            $scope.newOrder.id = $scope.newOrder.brand.name.substring(0, 2).toUpperCase() + '1';
                        }
                    }
                    $scope.newOrder.date = new Date();
                    OrdersFactory.postOrder($scope.newOrder);
                    $scope.newOrder = {subOrders: [], state: 1};
                    $scope.createOrder = false
                } else {
                    $mdToast.show(
                        $mdToast.simple()
                            .content('Veuillez entrer au moins une sous commande')
                            .position($scope.getToastPosition())
                            .hideDelay(3000)
                    );
                }
            } else {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Veuillez ajouter une image')
                        .position($scope.getToastPosition())
                        .hideDelay(3000)
                );
            }
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
            OrdersFactory.deleteOrder(order)
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