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
    'chart.js',
    'ngCsv'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'assets/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/Commandes', {
        templateUrl: 'assets/views/commandes.html',
        controller: 'CommandesCtrl'
      })
      .when('/Magasins', {
        templateUrl: 'assets/views/magasins.html',
        controller: 'MagasinsCtrl'
      })
      .when('/Comptes', {
        templateUrl: 'assets/views/users.html',
        controller: 'UsersCtrl'
      })
      .when('/mesCommandes', {
        templateUrl: 'assets/views/myOrders.html',
        controller: 'MyOrdersCtrl'
      })
      .when('/Visuels', {
        templateUrl: 'assets/views/images.html',
        controller: 'ImagesCtrl'
      })
      .when('/Historique', {
        templateUrl: 'assets/views/historique.html',
        controller: 'HistoriqueCtrl'
      })
      .when('/Settings', {
        templateUrl: 'assets/views/settings.html',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
