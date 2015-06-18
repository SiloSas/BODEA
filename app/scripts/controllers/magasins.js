angular.module('bodeaApp').controller('MagasinsCtrl', function ($scope, $timeout, $filter, $log) {
        $scope.stores = [
            {
                name: 'magasin1',
                brand: {name: 'enseigne1'},
                contactName: 'Réferent1',
                area: {name: 'region1'},
                phone: '00.00.00.00.00',
                deliveryAddress: 'rue fuse',
                billingAddress: 'rue fuse',
                priceByM2: 10,
                pipeSize: 2.3,
                weight: 5,
                printFormat: '5*6',
                width: 500,
                caneWidth: 500,
                enginesNumber: 2

            },
            {
                name: 'magasin2',
                brand: {name: 'enseigne2'},
                contactName: 'Réferent2',
                area: {name: 'region2'},
                phone: '00.00.00.00.00',
                deliveryAddress: 'rue fuse',
                billingAddress: 'rue fuse',
                priceByM2: 10,
                pipeSize: 2.3,
                weight: 5,
                printFormat: '5*6',
                width: 500,
                caneWidth: 500,
                enginesNumber: 2

            },
            {
                name: 'magasin2',
                brand: {name: 'enseigne1'},
                contactName: 'Réferent2',
                area: {name: 'region2'},
                phone: '00.00.00.00.00',
                deliveryAddress: 'rue fuse',
                billingAddress: 'rue fuse',
                priceByM2: 10,
                pipeSize: 2.3,
                weight: 5,
                printFormat: '5*6',
                width: 500,
                caneWidth: 500,
                enginesNumber: 2

            }
        ];
    $scope.areas = [
        {
            id: 1,
            name: 'region2'
        },
        {
            id: 2,
            name: 'region1'
        }
    ];

    $scope.limit = 20;
    $scope.predicate = 'brand';
    $scope.reverse = false;
    $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
    };

    $scope.copyStore = function (index) {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.stores[index].newStore = angular.copy($scope.stores[index]);
            })
        }, 0)
    };

    $scope.refactorStore = function (index) {
        $scope.stores[index] = $scope.stores[index].newStore;
    };

    $scope.remove = function (index) {
        $scope.stores.splice(index, 1)
    };


    $scope.areas        = loadAllAreas();
    $scope.brands        = loadAllBrands();
    $scope.querySearch   = querySearch;
    $scope.querySearchBrand   = querySearchBrand;
    $scope.selectedItemChange = selectedItemChange;
    $scope.searchTextChange   = searchTextChange;
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
        if ($scope.areas.filter( createFilterFor(query)).length == 0) {
            $scope.areas.push({name: query, value: query});
        }
        return query ? $scope.areas.filter( createFilterFor(query) ) : $scope.areas;
    }
    function querySearchBrand (query) {
        if ($scope.brands.filter( createFilterFor(query)).length == 0) {
            $scope.brands.push({name: query, value: query});
        }
        return query ? $scope.brands.filter( createFilterFor(query) ) : $scope.brands;
    }
    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
        //$scope.stores[index].area = item;
    }
    /**
     * Build `areas` list of key/value pairs
     */
    function loadAllAreas() {
        var allareas = 'Ain, Aisne, Allier, Alpes-de-Haute-Provence, Alpes-Maritimes, Ardèche, Ardennes, ' +
            'Ariège, Aube, Aude, Aveyron, Bas-Rhin, Bouches-du-Rhône, Calvados, Cantal, Charente, ' +
            'Charente-Maritime, Cher, Corrèze, Corse-du-Sud, Côte-d\'Or, Côtes-d\'Armor, Creuse, Deux-Sèvres, ' +
            'Dordogne, Doubs, Drôme, Essonne, Eure, Eure-et-Loir, Finistère, Gard, Gers, Gironde, Haut-Rhin, ' +
            'Haute-Corse, Haute-Garonne, Haute-Loire, Haute-Marne, Haute-Saône, Haute-Savoie, Haute-Vienne, ' +
            'Hautes-Alpes, Hautes-Pyrénées, Hauts-de-Seine, Hérault, Ille-et-Vilaine, Indre, Indre-et-Loire, ' +
            'Isère, Jura, Landes, Loir-et-Cher, Loire, Loire-Atlantique, Loiret, Lot, Lot-et-Garonne, Lozère, ' +
            'Maine-et-Loire, Manche, Marne, Mayenne, Meurthe-et-Moselle, Meuse, Morbihan, Moselle, Nièvre, Nord, ' +
            'Oise, Orne, Paris, Pas-de-Calais, Puy-de-Dôme, Pyrénées-Atlantiques, Pyrénées-Orientales, Rhône, ' +
            'Saône-et-Loire, Sarthe, Savoie, Seine-et-Marne, Seine-Maritime, Seine-Saint-Denis, Somme, Tarn, ' +
            'Tarn-et-Garonne, Territoire de Belfort, Val-d\'Oise, Val-de-Marne, Var, Vaucluse, Vendée, Vienne, ' +
            'Vosges, Yonne, Yvelines';
        return allareas.split(/, +/g).map( function (area) {
            return {
                value: area.toLowerCase(),
                name: area
            };
        });
    }
    function loadAllBrands() {
        var allbrands = 'enseigne1, enseigne2';
        return allbrands.split(/, +/g).map( function (brand) {
            return {
                value: brand.toLowerCase(),
                name: brand
            };
        });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(area) {
            return (area.value.indexOf(lowercaseQuery) === 0);
        };
    }
});