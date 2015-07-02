angular.module('bodeaApp').factory('UserFactory', function ($q, $http, UsersFactory, $cookies) {
   var factory = {
       user: false,
       getUser: function () {
           var deferred = $q.defer();
           if (factory.user != false) {
               deferred.resolve(factory.user)
           } else {
               UsersFactory.getUsers().then(function(users) {
                   var userLength = users.length;
                   var sessionCoockie = $cookies.get('PLAY_SESSION');
                   var sessionId = sessionCoockie.substring((sessionCoockie.indexOf('connected=')+10)).replace('"', '').replace(/&role=[\w]/g, '');
                   for (var i = 0; i < userLength; i++) {
                       if (users[i].user.uuid == sessionId) {
                           factory.user = users[i];
                           deferred.resolve(factory.user)
                       }
                   }
               });
           }
           return deferred.promise;
       },
       refactorUser: function (user) {
           factory.user = user.newUser;
           UsersFactory.refactorUser(user)
       },
       passToFalse : function () {
           factory.user = false;
       }
   };
   return factory;
});