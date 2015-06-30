angular.module('bodeaApp').factory('OrdersFactory', function ($q, $http, GuidFactory, StoresFactory) {
    var factory = {
        orders: false,
        getOrders: function () {
            var deferred = $q.defer();
            if (factory.orders != false) {
                deferred.resolve(factory.orders)
            } else {
                $http.get('models?table=orders').success(function (object) {
                    factory.orders = object.map(function (el) {
                        return JSON.parse(el.generalObject.objectString)
                    });
                    factory.orders = factory.orders.map(function (order) {
                        order.subOrders.map(function (subOrder) {
                            StoresFactory.getStoreById(subOrder.store.id).then(function (store) {
                                subOrder.store = store;
                            });
                            subOrder.price =
                                subOrder.store.priceByM2 * (parseInt(subOrder.store.printFormat.split('*')[0]) *
                                parseInt(subOrder.store.printFormat.split('*')[1]))*subOrder.numberItems;
                            subOrder.weight =
                                subOrder.store.weight*subOrder.numberItems;
                            return subOrder
                        });
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
                    });
                    deferred.resolve(factory.orders);
                });
            }
            return deferred.promise
        },
        refactorOrder: function (order) {
            for (var i = 0; i < factory.orders.length; i++) {
                if (factory.orders[i].uuid == order.uuid) {
                    order = angular.copy(order.newOrder);
                    delete(order.newOrder);
                    delete(order.newOrder);
                    factory.orders[i] = angular.copy(order);
                    $http.post('models/' + order.uuid + '?table=orders&objectString=' + JSON.stringify(order)).success(function (data, statut) {
                        console.log(data, statut)
                    }).error(function (error) {
                        console.log(error)
                    })
                }
            }
        },
        postOrder: function (order) {
            order.uuid = GuidFactory();
            factory.orders.push(order);
            $http.post('models?table=orders&uuid=' + order.uuid + '&objectString=' + JSON.stringify(order)).success(function (data) {
            }).error(function (error) {
            })
        },
        deleteOrder: function (order) {
            for (var i = 0; i < factory.orders.length; i++) {
                if (order.id == factory.orders[i].id) {
                    factory.orders.splice(i, 1)
                }
            }
            $http.delete('models/' + order.uuid + '?table=orders').success(function (data) {
                console.log(data)
            }).error(function (error) {
                console.log(error)
            })
        }
    };
    return factory;
});