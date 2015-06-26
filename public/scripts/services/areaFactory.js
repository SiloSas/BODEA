angular.module('bodeaApp').factory('AreaFactory',  function ($q,  $http,  GuidFactory) {
    var factory = {
        area: false, 
        getAreas: function () {
            var deferred = $q.defer();
            if (factory.area != false) {
                deferred.resolve(factory.area)
            } else {
                $http.get('models?table=areas').success(function(object) {
                    factory.area = object.map(function (el) {
                        return JSON.parse(el.objectString)
                    });
                    deferred.resolve(factory.area)
                })
            }
            return deferred.promise;
        }, 
        postArea: function (area) {
            area.id = GuidFactory();
            factory.area.push(area);
            $http.post('models?table=area&uuid='+ area.id + '&objectString='+ JSON.stringify(area))
        }
    };
    return factory;
});