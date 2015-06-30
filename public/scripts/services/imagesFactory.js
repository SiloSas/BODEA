angular.module('bodeaApp').factory('ImagesFactory', function ($q, $http, GuidFactory) {
    var factory = {
        images : false,
        getImages: function () {
            var deferred = $q.defer();
            if (factory.images != false) {
                deferred.resolve(factory.images)
            } else {
                factory.images = [{id: 1, name: 'test', theme: 'theme1', date:'10/03/15', url: 'images/caroussel1.gif'}];
                deferred.resolve(factory.images)
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
            factory.images.push(image);
            $http.post('/upload', image.file)
        }
    };
    return factory;
});