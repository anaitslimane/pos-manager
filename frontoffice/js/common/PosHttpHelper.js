angular.module("PosManager")
    .factory("PosHttpHelper", ["PosApiResponseStatusCode", function (PosApiResponseStatusCode)
    {
		var PosHttpResponseModel = function (statusCode, apiResult, apiStatusPlainText, errors)
        {
            this.StatusCode = statusCode;
            this.ApiResult = apiResult;
            this.ApiStatusPlainText = apiStatusPlainText;
            this.Errors = errors;
        }

        this.cleanupEntityBeforeRequest = function (entity)
        {
            if (typeof entity.errors !== "undefined")
            {
                delete (entity.errors);
            }
        }

        this.buildResponseModel = function (data, entity)
        {
            var statusCode = PosApiResponseStatusCode.Init;
            var apiResult = {};
            var apiStatusPlainText = "";
            var errors = [];

            if ((typeof data !== "undefined") && (typeof data.ApiResponseStatusCode !== "undefined"))
            {
            	statusCode = data.ApiResponseStatusCode;

        	    if(typeof data.ApiResult !== "undefined")
                {
        	    	apiResult = data.ApiResult;

                	if (typeof data.ApiStatusPlainText !== "undefined")
                	{
                		apiStatusPlainText = data.ApiStatusPlainText;
                	}
        	    }
            	else
        	    {
        	    	if (typeof data.ApiStatusPlainText !== "undefined")
        	    	{
        	    		apiStatusPlainText = data.ApiStatusPlainText;
        	    	}

        	    	if (typeof data.Errors !== "undefined")
        	    	{
        	    		errors = data.Errors;
        	    	}

        	    	if (statusCode === PosApiResponseStatusCode.ModelStateError)
        	    	{
        	    		entity["errors"] = data.Errors;
        	    	}
        	    }
            }

            return new PosHttpResponseModel(statusCode, apiResult, apiStatusPlainText, errors);
		};

        return this;
    }]);