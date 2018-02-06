angular.module("PosManager")
    .service("PosSaleOperationsDataFactory", ["$http", "PosGlobals", function ($http, PosGlobals)
    {

        var urlBase = PosGlobals.urls.api.base + "/saleoperations";

        var PosSaleOperationsDataFactory = {}

        PosSaleOperationsDataFactory.GetAllSaleOperations = function ()
        {
            return $http.get(urlBase + "/GetTodaysAll");
        };

        PosSaleOperationsDataFactory.GetSaleOperationById = function (id) {
            return $http(
                {
                    url: urlBase + "/GetSaleOperationById",
                    method: "GET",
                    params: {
                        id: id
                    }
                });
        };

        PosSaleOperationsDataFactory.CancelSaleOperation = function (saleOperation) {
            return $http.put(urlBase + "/CancelSaleOperation", saleOperation);
        };

        return PosSaleOperationsDataFactory;
    }]);