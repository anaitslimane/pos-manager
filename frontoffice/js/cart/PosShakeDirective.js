angular.module("PosManager")
	.directive("posShake", function ($animate) {
	    return {
	        restrict: "A",

	        scope: {
	            count: "="
	        },

	        link: function (scope, element, attrs)
	        {	            
	            var currCount = 0;

	            scope.$watch("count",
                    function (newCount)
                    {
                        if (newCount > 1 && newCount > currCount)
                        {
                            $animate.addClass(element, 'shake').then(function () {
                                element.removeClass('shake');
                            });
                        }
                        currCount = newCount;
                    }
                );
	        }
	    };
	});