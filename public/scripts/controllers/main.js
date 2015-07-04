'use strict';

/**
 * @ngdoc function
 * @name bodeaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the bodeaApp
 */
angular.module('bodeaApp')
  .controller('MainCtrl', function ($scope, $timeout, $mdSidenav, $mdUtil, $log, $location,
                                    ConnectionFactory, $rootScope, NotificationsFactory, UserFactory) {
        $scope.toggleLeft = buildToggler('left');
        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        $scope.limit = 20;
        function initUser () {
            UserFactory.getUser().then(function (user) {
                $scope.user = user;
            });
            $scope.notifications = NotificationsFactory.notifications;
            $scope.notificationBase = NotificationsFactory.notificationBase;
        }

        initUser();

        $rootScope.$watch('connected', function (newVal) {
            if (newVal != false) {
                initUser();
            }
        });

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
            if ($scope.active == '/') {
                NotificationsFactory.passIsReadedToTrue();
            }
        });
        $scope.forgottenpassword = function (login) {
            ConnectionFactory.forgottenpassword(login)
        };
        $scope.connect = function (user) {
            ConnectionFactory.connect(user)
        };
        $scope.disconnect = function () {
            ConnectionFactory.disconnect()
        };
        $scope.postNotification = function (notification, brandUUID) {
            NotificationsFactory.postNotification(notification, brandUUID)
        };
    });