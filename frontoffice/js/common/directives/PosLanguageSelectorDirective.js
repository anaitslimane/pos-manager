angular.module("PosManager")
	.directive("posLanguageSelector", ["PosGlobalsService", "PosLocaleService", function (PosGlobalsService, PosLocaleService)
	{
		return {
			restrict: "E",
			replace: true,
			templateUrl: "templates/common/directives/LanguageSelector.html",

			controller: function ($scope)
			{
			    var languageChangeArmed = false;
			    var newLocale;

				$scope.currentLocaleDisplayName = PosLocaleService.getLocaleDisplayName();
				$scope.localesDisplayNames = PosLocaleService.getLocalesDisplayNames();
				$scope.visible = $scope.localesDisplayNames &&
				$scope.localesDisplayNames.length > 1;

				$scope.ChangeLanguage = function (locale)
				{
				    newLocale = locale;

				    if (PosLocaleService.getLocaleDisplayName() !== newLocale)
				    {
				        languageChangeArmed = true;
				    }
				};

				$scope.ConfirmChangeLanguage = function()
				{
				    if (languageChangeArmed)
				    {
				        PosLocaleService.setLocaleByDisplayName(newLocale);
				        languageChangeArmed = false;

				        // reload global data in the new language
				        PosGlobalsService.LoadAllInitData();
				    }
				}
			}
		};
	}]);