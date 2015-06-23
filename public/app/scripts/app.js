'use strict';

/**
 * @ngdoc overview
 * @name bodeaApp
 * @description
 * # bodeaApp
 *
 * Main module of the application.
 */
angular
  .module('bodeaApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'mm.foundation',
    'ngMaterial',
    'chart.js'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/Commandes', {
        templateUrl: 'views/commandes.html',
        controller: 'CommandesCtrl'
      })
      .when('/Magasins', {
        templateUrl: 'views/magasins.html',
        controller: 'MagasinsCtrl'
      })
      .when('/Comptes', {
        templateUrl: 'views/users.html',
        controller: 'UsersCtrl'
      })
      .when('/mesCommandes', {
        templateUrl: 'views/myOrders.html',
        controller: 'MyOrdersCtrl'
      })
      .when('/Visuels', {
        templateUrl: 'views/images.html',
        controller: 'ImagesCtrl'
      })
      .when('/Historique', {
        templateUrl: 'views/historique.html',
        controller: 'HistoriqueCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
