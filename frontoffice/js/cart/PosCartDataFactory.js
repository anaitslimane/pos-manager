angular.module('PosManager')
    .service('PosCartDataFactory', ['$http', 'PosGlobals', function ($http, PosGlobals)
    {

        var urlBase = PosGlobals.urls.api.base + "/saleoperations";

    	var PosCartDataFactory = {}
        
    	PosCartDataFactory.GetCustomerById = function (cid) {
            return $http(
                {
                	url: urlBase + "/GetCustomerById/",
                    method: "GET",
                    params: {
                        cid: cid
                    }
                });
        };

    	PosCartDataFactory.AddSaleOperation = function (saleOperation) {    	    
    	    return $http.post(urlBase + "/AddSaleOperation", saleOperation);
        };

    	return PosCartDataFactory;
    }]);