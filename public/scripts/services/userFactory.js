angular.module('bodeaApp').factory('UserFactory', function ($q, $http) {
   var factory = {
       user: false,
       getUser: function () {
           var deferred = $q.defer();
           if (factory.user != false) {
               deferred.resolve(factory.user)
           } else {
               factory.user = {name: 'test', firstName: 'test', mail: 'test@test.test', password:'test', job: 'test'}
               deferred.resolve(factory.user)
           }
           return deferred.promise;
       }
   };
   return factory;
});