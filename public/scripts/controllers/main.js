'use strict';

/**
 * @ngdoc function
 * @name bodeaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bodeaApp
 */
angular.module('bodeaApp')
  .controller('MainCtrl', function ($scope, $timeout, $mdSidenav, $mdUtil, $log, $location, ConnectionFactory, $rootScope) {
        $scope.toggleLeft = buildToggler('left');
        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */

        $rootScope.filter = '';
        function buildToggler(navID) {
            var debounceFn =  $mdUtil.debounce(function(){
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            },300);
            return debounceFn;
        }
        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                });
        };
        $scope.active = $location.path();
        $scope.$on('$locationChangeSuccess', function () {
            $scope.active = $location.path();
        });
        $scope.connect = function (user) {
            ConnectionFactory.connect(user)
        };
        $scope.disconnect = function () {
            ConnectionFactory.disconnect()
        }
    });