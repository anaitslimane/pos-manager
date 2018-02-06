angular.module('PosManager')
    .service('PosCustomersDataFactory', ['$http', 'PosGlobals', function ($http, PosGlobals)
    {

    	var urlBase = PosGlobals.urls.api.base + "/customers";

        var PosCustomersDataFactory = {}

        PosCustomersDataFactory.GetAllCustomers = function ()
        {
            return $http.get(urlBase);
        };

        PosCustomersDataFactory.GetCustomerById = function (cid) {
            return $http(
                {
                	url: urlBase + "/GetCustomerById/",
                    method: "GET",
                    params: {
                        cid: cid
                    }
                });
        };

        PosCustomersDataFactory.GetCustomerGlobalPreviewData = function (cid) {
            return $http(
                {
                    url: urlBase + "/GetCustomerGlobalPreviewData/",
                    method: "GET",
                    params: {
                        cid: cid
                    }
                });
        };

        PosCustomersDataFactory.AddCustomer = function (cust) {
            return $http.post(urlBase, cust);
        };

        PosCustomersDataFactory.UpdateCustomer = function (cust) {
        	return $http.put(urlBase + '/UpdateCustomer', cust);
        };

        return PosCustomersDataFactory;
    }]);