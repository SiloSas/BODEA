angular.module('bodeaApp').factory('BrandFactory', function ($q, $http) {
    var factory = {
        brands: false,
        getBrands: function () {
            var deferred = $q.defer();
            if (factory.brands != false) {
                deferred.resolve(factory.brands)
            } else {
                $http.get('scripts/object.json').success(function (object) {
                    factory.brands = [];
                    function pushBrand (object) {
                        factory.brands.push(object.brand)
                    }
                    object.forEach(pushBrand);
                    deferred.resolve(factory.brands);
                });
            }
            return deferred.promise;
        }
    };
    return factory;
});