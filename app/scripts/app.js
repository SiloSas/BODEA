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
    'ngMaterial'
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
      .otherwise({
        redirectTo: '/'
      });
  });
