angular.module("PosManager")
	    .service("PosPlanTypesService",
        [
            function ()
            {
                "use strict";

	            var _currentPlanType = {};

	            return {
	                GetCurrentPlanType: function ()
	                {
	                    return _currentPlanType;
	                },

	                SetCurrentPlanType: function (planType)
	                {
	                    _currentPlanType = planType;
	                },

	                ResetCurrentPlanType: function ()
	                {
	                    _currentPlanType = {};
	                }
	            };
	        }]);