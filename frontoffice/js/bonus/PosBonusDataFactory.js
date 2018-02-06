angular.module("PosManager")
    .service("PosBonusDataFactory", ["$http", "PosGlobals", function ($http, PosGlobals)
    {
        var PosBonusDataFactory = {}
        
        PosBonusDataFactory.GetAllBonusTypes = function () {
            return $http(
                {
                    url: PosGlobals.urls.api.getAllBonusTypes,
                    method: "GET"
                });
        };

        return PosBonusDataFactory;
    }]);