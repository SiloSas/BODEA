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
                    factory.images = images;
                    deferred.resolve(factory.images)
                })
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
            console.log(image)
            var imagesLength = factory.images.length;
            for (var i = 0; i < imagesLength; i++) {
                if (factory.images[i].id == image.id) {
                    factory.images[i] = image.newImage;
                    delete factory.images[i].newImage;
                    return;
                    //refactor image
                }
            }
        },
        postImage: function (image) {
            image.uuid = GuidFactory();
            //factory.images.push(image);
            console.log(image.file)
            var fd = new FormData();
            fd.append('picture', image.file);
            $http.post('/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (success) {
                console.log(success)
                MessagesFactory.displayMessage('Votre image est bien enregistré')
            }).error(function (error) {
                MessagesFactory.displayMessage(error)
            })
        }
    };
    return factory;
});