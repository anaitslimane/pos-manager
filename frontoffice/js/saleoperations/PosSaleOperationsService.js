angular.module("PosManager")
	    .service("PosSaleOperationsService", [
            "$http",
            "PosSaleOperationsDataFactory",
            function ($http, PosSaleOperationsDataFactory)
            {
	            "use strict";

	            var _allSaleOperations = [];
	            var _currentSaleOperation = {};

	            _currentSaleOperation.UpdateObj = {};

	            var PopulateAllSaleOperations = function () {

	                PosSaleOperationsDataFactory.GetAllSaleOperations().then(
                        function (response) {
                            _allSaleOperations = response.data.ApiResult;
                        },
                        function (error) { }
                        );
	            };



	            return {
	                GetCurrentSaleOperation: function ()
	                {
	                    return _currentSaleOperation;
	                },

	                SetCurrentSaleOperation: function(sop)
	                {
	                    _currentSaleOperation = angular.extend(_currentSaleOperation, sop);

	                    _currentSaleOperation.UpdateObj.SaleOperationId = sop.Id;
	                    _currentSaleOperation.UpdateObj.IsCanceled = sop.IsCanceled;
	                },

	                SetCurrentSaleOperationCanceledState: function (isCanceled)
	                {
	                    _currentSaleOperation.UpdateObj.IsCanceled = isCanceled;
	                },

	                ResetCurrentSaleOperation: function ()
	                {
	                    _currentSaleOperation = {};
	                    _currentSaleOperation.UpdateObj = {};
	                },

	                GetAllSaleOperations: function () {
	                    return _allSaleOperations;
	                },

	                PopulateAllSaleOperations: function () {
	                    PopulateAllSaleOperations();
	                }
	            };
	        }]);