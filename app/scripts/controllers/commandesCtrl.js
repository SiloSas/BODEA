angular.module('bodeaApp').config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('commandePalette', {
        '50': 'CC0D00',
        '100': 'E17D13',
        '200': 'FFFF4F',
        '300': '01579b',
        '400': '259b24',
        '500': 'f44336',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    })
    }).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('commandeTheme')
        .accentPalette('commandePalette', {
            'default': '50', // by default use shade 400 from the pink palette for primary intentions
            'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
            'hue-2': '200', // use shade 600 for the <code>md-hue-2</code> class
            'hue-3': '400'
        }); // specify primary color, all
    // other color intentions will be inherited
    // from default
})
    .controller('CommandesCtrl', function ($scope) {
    $scope.commandes = [
        {
            id: 1,
            subOrders: [
                {
                    store: 'magasin2',
                    numberItems: 10,
                    deliveryAddress: 'rue fuse',
                    deliveryDate: new Date(),
                    price: 10,
                    weight: 4.3,
                    delivered: true
                },
                {
                    store: 'magasin2',
                    numberItems: 10,
                    deliveryAddress: 'rue fuse',
                    deliveryDate: new Date(),
                    price: 10,
                    weight: 4.3,
                    delivered: true
                }
            ],
            date: '10/11/11',
            state: 5,
            image : {name: 'image1', url: 'images/caroussel1.gif'}
        },
        {
            id: 3,
            subOrders: [{
                store: 'magasin2',
                numberItems: 10,
                deliveryAddress: 'rue fuse',
                deliveryDate: new Date(),
                price: 10,
                weight: 4.3,
                delivered: true
            },
            {
                store: 'magasin2',
                numberItems: 10,
                deliveryAddress: 'rue fuse',
                price: 10,
                weight: 4.3,
                delivered: false
            }],
            date: '10/11/11',
            state: 4,
            image : {name: 'image1', url: 'images/caroussel1.gif'}
        },
        {
            id: 2,
            brand: 'enseigne1',
            subOrders: [{
                store: 'magasin2',
                numberItems: 10,
                deliveryAddress: 'rue fuse',
                deliveryDate: new Date(),
                price: 10,
                weight: 4.3,
                delivered: false
            },
                {
                    store: 'magasin2',
                    numberItems: 10,
                    deliveryAddress: 'rue fuse',
                    deliveryDate: new Date(),
                    price: 10,
                    weight: 4.3,
                    delivered: false
                }],
            date: '10/11/11',
            state: 2,
            image : {name: 'image1', url: 'images/caroussel1.gif'}
        }
    ];
    $scope.copyCommande = function (index) {
        $scope.commandes[index].newCommande = angular.copy($scope.commandes[index]);
    };
    $scope.refactorCommande = function (index) {
        $scope.commandes[index] = $scope.commandes[index].newCommande;
    };
    $scope.changeState = function (order) {
        var isDelivered = true;
        for (var i = 0; i < order.subOrders.length; i++) {
            if (order.subOrders[i].delivered == false) {
                isDelivered = false
            }
        }
        if (isDelivered == true) {
            order.state = 5;
        } else {
            order.state = 4;
        }
    };
    $scope.predicate = 'date';
    $scope.reverse = false;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };
    $scope.remove = function (index) {
        $scope.commandes.splice(index, 1)
    }


    });