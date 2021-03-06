angular.module('bodeaApp').factory('UsersFactory', function ($q, $http, GuidFactory, StoresFactory, MessagesFactory) {
    var factory = {
        users: false,
        getUsers:  function () {
            var deferred = $q.defer();
            if (factory.users != false) {
                deferred.resolve(factory.users)
            } else {
                $http.get('models?table=users').success(function (users) {
                    factory.users = users.map(function(user) {
                        if (user.user.objectString == "undefined") {
                            delete(user.user.objectString);
                        }
                        if (user.relations.length > 0) {
                            user.relations.map(function(relation) {
                                if (relation.relationName == 'brands') {
                                    user.brand = JSON.parse(relation.maybeGeneralObject.objectString)
                                }
                            })
                        }
                        if (angular.isDefined(user.user.objectString)) {
                            user.user.objectString = JSON.parse(user.user.objectString);
                            if (angular.isDefined(user.user.objectString.stores)) {
                                user.stores = [];
                                var stores = angular.copy(user.user.objectString.stores)
                                var i = 0;
                                function getStoreById (storeId) {
                                    StoresFactory.getStoreById(storeId).then(function(store) {
                                        user.stores.push(store);
                                        if (i < stores.length) {
                                            i++;
                                            getStoreById(stores[i])
                                        }
                                    })
                                }
                                getStoreById(stores[i])
                            } else {
                                user.stores = [];
                            }
                        }
                        return user;
                    });
                    deferred.resolve(factory.users);
                })
            }
            return deferred.promise;
        },
        refactorUser: function (user) {
            if (angular.isDefined( user.newUser.user.password)) {
                $http.put('/users/password?login='+ user.user.login +'&password='  + user.newUser.user.password)
            }
            for (var i = 0; i < factory.users.length; i++) {
                if (user.user.uuid == factory.users[i].user.uuid) {
                    user = angular.copy(user.newUser);
                    factory.users[i] = user
                }
            }
            if (angular.isDefined(user.brand)) {
                $http.post('relations',
                    {relations : [{
                        relationTable: 'userbrand',
                        uuidA: user.user.uuid,
                        uuidB: user.brand.id
                    }]}).success(function(success) {
                    }).error(function(error) {
                    });
            }
            if (angular.isDefined(user.stores)) {
                user.stores.map(function (store) {
                    $http.post('relations',
                        {relations :[{
                            relationTable: 'storeuser',
                            uuidA: store.id,
                            uuidB: user.user.uuid
                        }]}).success(function(success) {
                        }).error(function(error) {
                        });
                });

            }
            $http.put('users?uuid='+ user.user.uuid + '&login=' + user.user.login +
                '&role=' + user.user.role + '&objectString='+ JSON.stringify(user.user.objectString) +
                '&isActive=' + user.user.isActive).success(function (success) {
                MessagesFactory.displayMessage('L\'utilisateur a bien été mis à jour')
            }).error(function(error) {
                MessagesFactory.displayMessage(error)
            });
        },
        deleteUser: function (user) {
            for (var i = 0; i < factory.users.length; i++) {
                if (user.user.uuid == factory.users[i].user.uuid) {
                    factory.users.splice(i, 1)
                }
            }
        $http.delete('models/' + user.user.uuid + '?table=users');
        },
        postUser: function (user) {
            var deferred = $q.defer();
            user.user.uuid = GuidFactory();
            $http.post('users?uuid='+user.user.uuid+'&password='+user.user.password+
                '&login='+user.user.login+'&role='+user.user.role+'&objectString=' +
                JSON.stringify(user.user.objectString) + '&isActive=' + user.user.isActive).
                success(function (success) {
                    MessagesFactory.displayMessage('L\'utilisateur est bien enregistré');
                    factory.users.push(user);
                    deferred.resolve(success)
                    if (angular.isDefined(user.brand) && user.brand != null) {
                        $http.post('relations',
                            {relations :[{
                                relationTable: 'userbrand',
                                uuidA: user.user.uuid,
                                uuidB: user.brand.id
                            }]}).success(function(success) {
                            }).error(function(error) {
                            });
                    }
                    if (angular.isDefined(user.stores)) {
                        user.stores.map(function (store) {
                            $http.post('relations',
                                {relations :[{
                                    relationTable: 'storeuser',
                                    uuidA: store.id,
                                    uuidB: user.user.uuid
                                }]}).success(function(success) {
                                }).error(function(error) {
                                });
                        });

                    }
            }).error(function(error) {
                if (error.indexOf('duplicate key') > -1) {
                    error = 'Cet utilisateur existe déjà'
                } else {
                    error = 'Une erreur s\'est produite'
                }
                MessagesFactory.displayMessage(error);
                deferred.reject(error)
            });
            return deferred.promise;
        },
        passToFalse : function () {
            factory.users = false;
        }
    };
    return factory;
});