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
                        return JSON.parse(el.generalObject.objectString)
                    });
                    deferred.resolve(factory.brands);
                });
            }
            return deferred.promise;
        },
        postBrand: function (brand) {
            brand.id = GuidFactory();
            delete(brand.$$hashKey);
            if (factory.brands.indexOf(brand) == -1) {
                factory.brands.push(brand);
            }
            for (var i =0; i < factory.brands.length; i++) {
                if (angular.isDefined(factory.brands[i].flag)) {
                    factory.brands.splice(i, 1);
                    i--;
                }
            }
            $http.post('/models?table=brands&uuid='+ brand.id + '&objectString=' + JSON.stringify(brand)).success(function (object) {
            });
            return brand;
        }
    };
    return factory;
});