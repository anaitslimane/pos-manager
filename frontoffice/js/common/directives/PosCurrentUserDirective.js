angular.module("PosManager")
	.directive("posCurrentUser", function ($http, PosGlobals, PosSessionService, $document) {
	    return {
	        restrict: "EA",
	        replace: true,
	        transclude: true,
	        templateUrl: "templates/common/directives/CurrentUser.html",

	        scope: {
	            currUser: "=",
	            onClickSignInBtn: "&",
	            onClickSignOutBtn: "&"
	        },

	        link: function (scope, element, attrs)
	        {
	            scope.$watch(
                    function () {
                        return PosSessionService.GetCurrentUser();
                    },
                    function (user) {
                        scope.CurrentUser = user;
                    }
                );
	        }
	    };
	});