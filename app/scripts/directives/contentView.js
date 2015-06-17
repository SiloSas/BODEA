angular.module('bodeaApp').directive('contentView', function () {
    return {
        restrict: 'C',
        link: function (scope, element) {
            function calculSize() {
                var height = window.innerHeight - document.getElementById('topBar').clientHeight;
                element[0].style.height = height + 'px';
            }
            calculSize();
            window.addEventListener('resize', calculSize)
            scope.$on('$destroy', function() {
                window.removeEventListener('resize', calculSize)
            });
        }
    }
});