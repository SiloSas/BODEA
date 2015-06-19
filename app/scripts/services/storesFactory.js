angular.module('bodeaApp').factory('StoresFactory', function ($q, $http) {
    var factory = {
        stores: false,
        getStores: function () {
            var deferred = $q.defer();
            if (factory.stores != false) {
                deferred.resolve(factory.stores)
            } else {
                $http.get('scripts/object.json').success(function (object) {
                    factory.stores = [];
                    function pushStore (element) {
                        factory.stores = factory.stores.concat(element.stores)
                    }
                    object.forEach(pushStore);
                    deferred.resolve(factory.stores);
                });
            }
            return deferred.promise
        }
    };
    return factory;
});