angular.module("PosManager")
    .directive("backToTop", [ function ()
    {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.click(function () {
                    window.scrollTo(0, angular.element("#back-to-top").offsetTop);
                });
            }
        };
    }]);