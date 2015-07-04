angular.module('bodeaApp').factory('NotificationsFactory', function ($http, GuidFactory) {
    var factory =  {
        notifications: [],
        notificationBase: [],
        eventSource: false,
        getNotifications: function () {
            $http.get('models?table=notifications').success(function (notifications) {
                notifications.map(function (notification) {
                    factory.notificationBase.push(JSON.parse(notification.generalObject.objectString));
                });
            });
        },
        subscribe: function () {
            factory.eventSource = new EventSource("/notifications");
            factory.eventSource.onmessage = function (event) {
                factory.notificationLength = factory.notificationLength+1;
                factory.notifications.push(JSON.parse(event.data));
            };
        },
        passIsReadedToTrue: function () {
            factory.notificationBase = factory.notificationBase.concat(angular.copy(factory.notifications));
            factory.notifications.splice(0, factory.notifications.length);
        },
        postNotification: function (notification, brandUUID) {
            factory.notificationLength = factory.notificationLength+1;
            var newNotification = {};
            newNotification.notification = notification;
            newNotification.uuid = GuidFactory();
            newNotification.date = new Date();
            newNotification.brand = brandUUID;
            brandUUID = GuidFactory();
            $http.post('notifications?notification=' +
                JSON.stringify(newNotification) + '&brandUUID=' + brandUUID +
                '&notificationUUID=' + newNotification.uuid).success(function (success) {
            })
        },
        passToFalse: function () {
            factory.notificationBase.splice(0, factory.notificationBase.length);
            factory.notifications.splice(0, factory.notifications.length);
            factory.eventSource.close()
        }
    };
    return factory;
});