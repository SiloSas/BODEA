angular.module('bodeaApp').factory('OrdersFactory', function ($q, $http) {
    var factory = {
        orders: false,
        getOrders: function () {
            var deferred = $q.defer();
            if (factory.orders != false) {
                deferred.resolve(factory.orders)
            } else {
                $http.get('models?table=orders').success(function (object) {
                    factory.orders = object;
                    deferred.resolve(factory.orders);
                });
            }
            return deferred.promise
        },
        refactorOrder: function (order) {
            for (var i = 0; i < factory.orders.length; i++) {
                if (factory.orders[i].id == order.id) {
                    order = angular.copy(order.newOrder);
                    delete(order.newOrder);
                    factory.orders[i] = angular.copy(order);
                }
            }
            $http.post('orders/' + order.id, {table: 'orders', objectString: order}).success(function (data) {
                console.log(data)
            }).error(function (error) {
                console.log(error)
            })
        },
        postOrder: function (order) {
            factory.orders.push(order);
            $http.post('orders/', {table: 'orders', uuid: order.id, objectString: order}).success(function (data) {
                console.log(data)
            }).error(function (error) {
                console.log(error)
            })
        },
        deleteOrder: function (order) {
            for (var i = 0; i < factory.orders.length; i++) {
                if (order.id == factory.orders[i].id) {
                    factory.orders.splice(i, 1)
                }
            }
            $http.delete('orders/' + order.id).success(function (data) {
                console.log(data)
            }).error(function (error) {
                console.log(error)
            })
        }
    };
    return factory;
});