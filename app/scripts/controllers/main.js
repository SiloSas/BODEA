'use strict';

/**
 * @ngdoc function
 * @name bodeaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bodeaApp
 */
angular.module('bodeaApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
