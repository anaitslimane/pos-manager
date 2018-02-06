angular.module("PosManager")
    .factory(
        "HttpInterceptorFactory",
        [
            "$rootScope",
            "$q",
            "PosGlobals",
            "PosLocaleService",
            function HttpInterceptorFactory($rootScope, $q, PosGlobals, PosLocaleService)
            {
                return {

                    "request": function (config)
                    {
            	        // append proper locale for each api request
            	        if (config.url.indexOf(PosGlobals.urls.api.flag) > -1)
            		        config.url = config.url + "?locale=" + PosLocaleService.getCurrentLocale();

                        return config;
                    },

                //            // optional method
                //            'requestError': function (rejection)
                //            {
                //                if (canRecover(rejection)) {
                //                    return responseOrNewPromise
                //                }
                //                return $q.reject(rejection);
                //            },

                //            // optional method
                //            'response': function (response)
                //            {
                //                return response;
                //            },

                    "responseError": function (rejection)
                    {
                        if (rejection.status <= 0) {
                            $rootScope.$broadcast("server-unreachable");
                        }

                        // used for when user is not authorized to access a WebAPI controller method
                        if (rejection.status === 401) {
                            $rootScope.$broadcast("unauthorized-request");
                        }

                        // used for when the WebAPI endpoint does not exist
                        else if (rejection.status === 404) {
                            $rootScope.$broadcast("error-message", { message: "Page does not exist", status: 404 });
                        }
                            // used for "item with same XY (for example "name") already exists"
                        else if (rejection.status === 409) {
                            
                        }
                        //used for invalid .net ModelState
                        //else if (rejection.status === 422) {
                        //invalid model states handled in controllers
                        //}

                        ////console.log(rejection);
                        ////console.log(rejection.data);

                        //if (rejection.data && rejection.data.exceptionMessage)
                        //    NotificationService.showWarning(rejection.data.exceptionMessage);

                        return $q.reject(rejection);
                    }
                };
            }]);

angular.module("PosManager").config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push("HttpInterceptorFactory");
}]);