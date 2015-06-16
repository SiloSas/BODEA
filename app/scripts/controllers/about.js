'use strict';

/**
 * @ngdoc function
 * @name bodeaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the bodeaApp
 */
angular.module('bodeaApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
