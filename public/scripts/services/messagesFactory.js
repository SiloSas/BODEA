angular.module('bodeaApp').factory('MessagesFactory', function ($mdToast) {
    var factory = {
        displayMessage : function (message) {
            var toastPosition = {
                bottom: false,
                top: true,
                left: false,
                right: true
            };
            var getToastPosition = function () {
                return Object.keys(toastPosition)
                    .filter(function (pos) {
                        return toastPosition[pos];
                    })
                    .join(' ');
            };
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position(getToastPosition())
                    .hideDelay(5000)
            );
        }
    };
    return factory;
});