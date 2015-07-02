angular.module('bodeaApp').factory('ImagesFactory', function ($q, $http, GuidFactory, MessagesFactory) {
    var factory = {
        images : false,
        getImages: function () {
            var deferred = $q.defer();
            if (factory.images != false) {
                deferred.resolve(factory.images)
            } else {
                $http.get('models?table=images').success(function (images) {
                    console.log(images)
                    factory.images = images.map(function (image) {
                        return JSON.parse(image.generalObject.objectString)
                    });
                    deferred.resolve(factory.images)
                })
            }
            return deferred.promise;
        },
        getImageById: function (id) {
            var deferred = $q.defer()
            if (factory.images == false) {
                factory.getImages().then(function (images) {
                    for (var i = 0; i < images.length; i++) {
                        if (images[i].uuid == id) {
                            deferred.resolve(images[i]);
                        }
                    }
                })
            } else {
                for (var i = 0; i < factory.images.length; i++) {
                    if (factory.images[i].uuid == id) {
                        deferred.resolve(factory.images[i]);
                    }
                }
            }
            return deferred.promise;
        },
        deleteImage: function (id) {
            var imagesLength = factory.images.length;
            for (var i = 0; i < imagesLength; i++) {
                if (factory.images[i].id == id) {
                    factory.images.splice(i, 1);
                    return;
                    //delete image
                }
            }
        },
        refactorImage: function (image) {
            if (angular.isDefined(image.newImage.file)) {
                var fd = new FormData();
                fd.append('picture', image.newImage.file);
                $http.post('/upload', fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).success(function (success) {
                    image.newImage.url = success;
                    delete(image.newImage.file);
                    $http.post('models/' + image.newImage.uuid + '?table=images&objectString=' + JSON.stringify(image.newImage)).
                        success(function () {
                            var imagesLength = factory.images.length;
                            for (var i = 0; i < imagesLength; i++) {
                                if (factory.images[i].uuid == image.newImage.uuid) {
                                    factory.images[i] = image.newImage;
                                    delete factory.images[i].newImage;
                                }
                            }
                            MessagesFactory.displayMessage('Votre image est bien enregistré')
                        });
                }).error(function (error) {
                    MessagesFactory.displayMessage(error)
                })
            } else {
                $http.post('models/' + image.newImage.uuid + '?table=images&objectString=' + JSON.stringify(image.newImage)).
                    success(function () {
                        var imagesLength = factory.images.length;
                        for (var i = 0; i < imagesLength; i++) {
                            if (factory.images[i].uuid == image.newImage.uuid) {
                                factory.images[i] = image.newImage;
                                delete factory.images[i].newImage;
                            }
                        }
                        MessagesFactory.displayMessage('Votre image est bien enregistré')
                    });
            }
        },
        postImage: function (image) {
            image.uuid = GuidFactory();
            console.log(image.file)
            var fd = new FormData();
            fd.append('picture', image.file);
            $http.post('/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (success) {
                image.url = success;
                delete(image.file);
                $http.post('models?table=images&uuid=' + image.uuid + '&objectString=' + JSON.stringify(image)).
                    success(function() {
                        factory.images.push(image);
                        console.log(success)
                        MessagesFactory.displayMessage('Votre image est bien enregistré')
                    });
            }).error(function (error) {
                MessagesFactory.displayMessage(error)
            })
        }
    };
    return factory;
});