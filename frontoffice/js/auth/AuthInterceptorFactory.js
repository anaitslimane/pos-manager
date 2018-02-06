angular.module("PosManager")
    .factory("AuthInterceptorFactory",
    [
        "$q",
        "$rootScope",
        "localStorageService",
        "PosGlobals",
        function ($q, $rootScope, localStorageService, PosGlobals) {
            'use strict';

            var AuthInterceptorFactory = {};

            var _request = function (config)
            {
                config.headers = config.headers || {};

                var currentUser = localStorageService.get("PosCurrentUser");

                if (currentUser) {
                    config.headers.Authorization = "Bearer " + currentUser.token;
                }

                return config;
            }

            var _responseError = function (rejection)
            {
                if (rejection.status == 401) {
                    $rootScope.$broadcast("unauthorized");
                }

                return $q.reject(rejection);
            }

            AuthInterceptorFactory.request = _request;
            AuthInterceptorFactory.responseError = _responseError;

            return AuthInterceptorFactory;
        }
    ]);

angular.module("PosManager").config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push("AuthInterceptorFactory");
}]);