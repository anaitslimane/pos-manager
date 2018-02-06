angular.module("PosManager")
    .service("PosPlanTypesDataFactory", ["$http", "PosGlobals", function ($http, PosGlobals)
    {

        var urlBase = PosGlobals.urls.api.base + "/plantypes";

        var PosPlanTypesDataFactory = {}

        PosPlanTypesDataFactory.GetAllPlanTypes = function ()
        {
            return $http.get(urlBase + "/getallplantypes");
        };

    	return PosPlanTypesDataFactory;
    }]);