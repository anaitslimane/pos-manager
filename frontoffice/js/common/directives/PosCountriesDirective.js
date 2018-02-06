angular.module("PosManager")
    .directive("posCountries",
    [
        "localStorageService",
        "$http",
        "PosLocaleService",
        "PosGlobals",
        function (localStorageService, $http, PosLocaleService, PosGlobals)
        {
		    return {
    		    restrict: 'E',
    		    replace: true,
    		    scope : {
    			    selectedCountryCode : "="
    		    },
    		    template:
                    "" +
                        "<select data-ng-options='country.CountryCode as country.Name for country in countries track by country.CountryCode'>" +
                            "<option value='' selected>{{SelectedCountry.Name}}</option>" +
                        "</select>" +
                    "",
                link: function (scope, element, attrs)
                {
                    this.SetSelectedCountry = function ()
                    {
                        for (var i = 0; i < scope.countries.length; i++)
                        {
                        	if (scope.countries[i].CountryCode === scope.selectedCountryCode)
                        	{
                        		scope.SelectedCountry = scope.countries[i];
                        		break;
                        	}
                        }
                    }

                    this.GetFromCache = function (lang)
                    {
                        return localStorageService.get("PosCountries" + lang);
                    };

                    this.SaveToCache = function (countries, lang)
                    {
                        localStorageService.set("PosCountries" + lang, countries);
                    };

                    // init
                    var countries = [];
                    var currLang = PosLocaleService.getCurrentLocale().substring(0, 2);
                    var countriesFromCache = this.GetFromCache(currLang);

                    if (countriesFromCache && countriesFromCache.length > 0)
                    {
                        scope.countries = countriesFromCache;
                        this.SetSelectedCountry();
                    }
                    else
                    {
                        $http.get(PosGlobals.urls.api.getAllCountries).then(
							function success(response)
							{
								scope.countries = response.data.ApiResult;
								this.SetSelectedCountry();

								if (scope.countries.constructor === Array && scope.countries.length > 0)
								    this.SaveToCache(scope.countries, currLang)
							},
							function error()
							{

							});
                    }
                }
            };
        }]);