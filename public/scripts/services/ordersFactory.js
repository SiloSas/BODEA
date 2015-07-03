angular.module('bodeaApp').factory('OrdersFactory', function ($q, $http, GuidFactory, StoresFactory,
                                                              MessagesFactory, ImagesFactory, NotificationsFactory) {
    function postNotifiation(order) {
        var notification;
        switch (parseInt(order.state)) {
            case 1:
                notification = 'La commande ' + order.id + ' pour ' + order.brand.name + ' a été passée';
                NotificationsFactory.postNotification(notification, order.brand.id);
                console.log(order)
                break;

            case 2:
                notification = 'La commande ' + order.id + ' a été validée par l\'administrateur';
                NotificationsFactory.postNotification(notification, order.brand.id)
                break;

            case 4:
                notification = 'La commande ' + order.id + ' est en cours de livraison';
                console.log(notification)
                NotificationsFactory.postNotification(notification, order.brand.id)
                break;
        }
        console.log(order.state)
    }

    var factory = {
        orders: false,
        getOrders: function () {
            var deferred = $q.defer();
            if (factory.orders != false) {
                deferred.resolve(factory.orders)
            } else {
                $http.get('models?table=orders').success(function (object) {
                    console.log(object)
                    factory.orders = object.map(function (el) {
                        var order =  JSON.parse(el.generalObject.objectString)
                        function getImage(id) {
                            ImagesFactory.getImageById(id).then(function (image) {
                                order.image = image;
                            });
                        }

                        for (var i = 0; i < el.relations.length; i++) {
                            if (el.relations[i].relationName == 'images') {
                                getImage(el.relations[i].maybeGeneralObject.uuid);
                            }
                        }

                        return order;
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
            var orderState = angular.copy(order.state);
            for (var i = 0; i < factory.orders.length; i++) {
                if (factory.orders[i].uuid == order.uuid) {
                    order = angular.copy(order.newOrder);
                    delete(order.newOrder);
                    delete(order.newOrder);
                    factory.orders[i] = angular.copy(order);
                    $http.post('models/' + order.uuid + '?table=orders&objectString=' + JSON.stringify(order)).success(function (data, statut) {
                        MessagesFactory.displayMessage('Votre commande a bien été mise à jour');
                        if (order.state > orderState) {
                            postNotifiation(order);
                        }
                        $http.post('relations',
                            {relations : [{
                                relationTable: 'orderbrand',
                                uuidA: order.uuid,
                                uuidB: order.brand.id
                            }]}).success(function(success) {
                                console.log(success)
                            }).error(function(error) {
                                console.log(error)
                            });
                        if (angular.isDefined(order.image)) {
                            $http.post('relations',
                                {relations : [{
                                    relationTable: 'orderimage',
                                    uuidA: order.uuid,
                                    uuidB: order.image.uuid
                                }]}).success(function(success) {
                                    console.log(success)
                                }).error(function(error) {
                                    console.log(error)
                                });
                        }
                    }).error(function (error) {
                        MessagesFactory.displayMessage(error)
                    })
                }
            }
        },
        postOrder: function (order) {
            order.uuid = GuidFactory();
            factory.orders.push(order);
            $http.post('models?table=orders&uuid=' + order.uuid + '&objectString=' + JSON.stringify(order)).
                success(function (data) {
                    if (order.state > 0) {
                        postNotifiation(order);
                    }
                    $http.post('relations',
                        {relations : [{
                            relationTable: 'orderbrand',
                            uuidA: order.uuid,
                            uuidB: order.brand.id
                        }]}).success(function(success) {
                            console.log(success)
                        }).error(function(error) {
                            console.log(error)
                        });
                    if (angular.isDefined(order.image)) {
                        $http.post('relations',
                            {relations : [{
                                relationTable: 'orderimage',
                                uuidA: order.uuid,
                                uuidB: order.image.uuid
                            }]}).success(function(success) {
                                console.log(success)
                            }).error(function(error) {
                                console.log(error)
                            });
                    }
                    MessagesFactory.displayMessage('Votre command est bien enregistré')
            }).error(function (error) {
                    MessagesFactory.displayMessage(error)
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
        },
        passToFalse : function () {
            factory.orders = false;
        }
    };
    return factory;
});