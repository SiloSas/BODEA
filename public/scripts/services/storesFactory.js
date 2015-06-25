angular.module('bodeaApp').factory('StoresFactory', function ($q, $http) {
    var factory = {
        stores: false,
        getStores: function () {
            var deferred = $q.defer();
            if (factory.stores != false) {
                deferred.resolve(factory.stores)
            } else {
                $http.get('models?table=stores').success(function (object) {
                    factory.stores = object.map(function (el) {
                        return JSON.parse(el.objectString)
                    });
                    deferred.resolve(factory.stores);
                });
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
            $http.post('stores/' + store.id, {table: 'stores', objectString: store}).success(function (data) {
                console.log(data)
            }).error(function (error) {
                console.log(error)
            })
        },
        postStore: function (store) {
            factory.stores.push(store);
            var stringStore = JSON.stringify(store);
            console.log(stringStore)
            $http.post('models?table=stores&uuid=' + store.id + '&objectString=' + stringStore).success(function (data) {
                console.log(data)
            }).error(function (error) {
                console.log(error)
            })
        }
    };
    return factory;
});