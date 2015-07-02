angular.module('bodeaApp').factory('NotificationsFactory', function ($http) {
    return {

        subscribe: function () {
            new EventSource("/notifications").onmessage = function (event) {
                console.log(event.data);
            };
        },

        postNotification: function (notification) {
            $http.post('notifications?notification=' + notification).success(function (success) {
            })
        }
    };
});