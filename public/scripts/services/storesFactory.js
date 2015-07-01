angular.module('bodeaApp').factory('StoresFactory', function ($q, $http, GuidFactory, MessagesFactory) {
    var factory = {
        stores: false,
        getStores: function () {
            var deferred = $q.defer();
            if (factory.stores != false) {
                deferred.resolve(factory.stores)
            } else {
                $http.get('models?table=stores').success(function (object) {
                    console.log(object);
                    factory.stores = object.map(function (el) {
                        return JSON.parse(el.generalObject.objectString)
                    });
                    deferred.resolve(factory.stores);
                });
            }
            return deferred.promise
        },
        getStoreById: function (id) {
            var deferred = $q.defer();
            if (factory.stores != false) {
                for (var i = 0; i < factory.stores.length; i++) {
                    if (id === factory.stores[i].id) {
                        deferred.resolve(factory.stores[i])
                    }
                }
            } else {
                factory.getStores().then(function () {
                    for (var i = 0; i < factory.stores.length; i++) {
                        if (id === factory.stores[i].id) {
                            deferred.resolve(factory.stores[i])
                        }
                    }
                })
            }
            return deferred.promise
        },
        refactorStore: function (store) {
            for (var i = 0; i < factory.stores.length; i++) {
                if (factory.stores[i].id == store.id) {
                    store = angular.copy(store.newStore);
                    factory.stores[i] = store;
                    delete(store.newStore);
                }
            }
            $http.post('models/' + store.id + '?table=stores&objectString=' + JSON.stringify(store)).success(function (data) {
                MessagesFactory.displayMessage('Le magasin est bien mise à jours')
            }).error(function (error) {
                MessagesFactory.displayMessage(error)
            })
        },
        postStore: function (store) {
            store.id = GuidFactory();
            factory.stores.push(store);
            var stringStore = JSON.stringify(store);
            $http.post('models?table=stores&uuid=' + store.id + '&objectString=' + stringStore).success(function (data) {
                if (angular.isDefined(store.brand.id)) {
                    $http.post('relations',
                        [{
                            relationTable: 'stores',
                            uuidA: store.id,
                            uuidB: store.brand.id
                        }]).success(function(success) {
                            console.log(success)
                        }).error(function(error) {
                            console.log(error)
                        });
                }
            }).success(function (data) {
                MessagesFactory.displayMessage('Le magasin est bien enregistré')
            }).error(function (error) {
                MessagesFactory.displayMessage(error)
            })
        },
        deleteStore: function (store) {
            for (var i = 0; i < factory.stores.length; i++) {
                if (factory.stores[i].id == store.id) {
                    factory.stores.splice(i, 1);
                }
            }
            $http.delete('models/' + store.id + '?table=stores').success(function (data) {
                console.log(data)
            }).error(function (error) {
                console.log(error)
            })
        }
    };
    return factory;
});