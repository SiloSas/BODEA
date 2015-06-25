angular.module('bodeaApp').factory('BrandFactory', function ($q, $http, GuidFactory) {
    var factory = {
        brands: false,
        getBrands: function () {
            var deferred = $q.defer();
            if (factory.brands != false) {
                deferred.resolve(factory.brands)
            } else {
                $http.get('/models?table=brands').success(function (object) {
                    factory.brands = object.map(function (el) {
                        return JSON.parse(el.objectString)
                    });
                    deferred.resolve(factory.brands);
                });
            }
            return deferred.promise;
        },
        postBrand: function (brand) {
            brand.id = GuidFactory();
            delete(brand.$$hashKey);
            factory.brands.push(brand);
            console.log(factory.brands);
            $http.post('/models?table=brands&uuid='+ brand.id + '&objectString=' + JSON.stringify(brand)).success(function (object) {
            });
            return brand;
        }
    };
    return factory;
});