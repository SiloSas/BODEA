angular.module('bodeaApp').factory('OrdersFactory', function ($q, $http) {
    var factory = {
        orders: false,
        getOrders: function () {
            var deferred = $q.defer();
            if (factory.orders != false) {
                deferred.resolve(factory.orders)
            } else {
                $http.get('scripts/object.json').success(function (object) {
                    factory.orders = [];
                    function pushStore (element) {
                        var numberOrders = element.orders.length;
                        for (var j = 0; j < numberOrders; j++) {
                            element.orders[j].brand = element.brand;
                            element.orders[j].state = Math.floor((Math.random() * 5) + 1);
                            var numberStores = element.stores.length;
                            var numberSubOrders = element.orders[j].subOrders.length;
                            for (var i = 0; i < numberSubOrders; i++) {
                                element.orders[j].subOrders[i].store =
                                    element.stores[Math.floor((Math.random() * numberStores) + 1)]
                            }
                        }
                        factory.orders = factory.orders.concat(element.orders)
                    }
                    object.forEach(pushStore);
                    deferred.resolve(factory.orders);
                });
            }
            return deferred.promise
        }
    };
    return factory;
});