angular.module('bodeaApp').factory('BrandFactory', function ($q, $http) {
    var factory = {
        brands: false,
        getBrands: function () {
            var deferred = $q.defer();
            if (factory.brands != false) {
                deferred.resolve(factory.brands)
            } else {
                factory.brands = 'enseigne1, enseigne2';
                deferred.resolve(factory.brands)
            }
            return deferred.promise;
        }
    };
    return factory;
});