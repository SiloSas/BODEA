angular.module('bodeaApp').directive('appFilereader', function($q, $parse) {
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.appFilereader);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });

        } //link
    }; //return
});