angular.module("PosManager")
	.directive("posSearchClients", function ($http, PosGlobals, $document) {
	    return {
	        restrict: "EA",
	        replace: true,
	        transclude: true,
	        templateUrl: "templates/common/directives/SearchClients.html",

	        scope: {
	            searchTerm: "=",
	            currSearchResultsList: "=",
	            onClickEditBtn: "&",
	            onClickViewBtn: "&",
	            onClickSelectCustomer: "&",
	            onClickEditPlansBtn : "&"
	        },

	        link: function (scope, element, attrs)
	        {
	            var SearchResults = {};
	            var InfructuousTerms = [];

	            scope.$watch("CustomersSearchTermModel",
                    function (term) {
                        if (!!term && (InfructuousTerms.indexOf(term) == -1)) {
                            UpdateSearchResults(term);
                            ShowSearchResultsBox();
                        }
                        else {
                            scope.CurrentSearchResultsList = [];
                        }
                    }
                );

	            $document.on("click", function (e) {
	                if(e.target.id !== "search-term")
	                {
	                	HideSearchResultsBox();
	                	EmptySearchField();
	                }
	                else
	                {
	                    ShowSearchResultsBox();
	                }
	            });
	            
	            function UpdateSearchResults(term)
	            {	                
	                if (term in SearchResults)
	                {
	                    scope.CurrentSearchResultsList = SearchResults[term];
	                }
	                else
	                {
	                    $http({
	                        url: PosGlobals.urls.api.searchCustomers,
	                        method: "GET",
	                        params: {
	                            Term: term
	                        }
	                    })
                        .then(
                            function (response)
                            {
                            	if (response.data.ApiResult.length > 0)
                            	{
                            		SearchResults[term] = response.data.ApiResult;
                            		scope.CurrentSearchResultsList = response.data.ApiResult;
                            	}
                            	else
                            	{
                            		InfructuousTerms.push(term);
                            		scope.CurrentSearchResultsList = [];
                            	}
                            },
                            function (error) {
                                return;
                            }
                        );
	                }
	            }

	            function HideSearchResultsBox() {
	                element.find("#search-results-list").css({ display: "none" });
	            }

	            function EmptySearchField()
	            {
	            	//element.find("#search-term").empty();
	            }

	            function ShowSearchResultsBox() {
	                element.find("#search-results-list").css({ display: "block" });
	            }
	        }
	    };
	});

angular.module("PosManager")
    .directive("stopEvent", function () {
        return {
            restrict: "A",
            link: function (scope, element, attr) {
                element.bind("click", function (e) {
                    return false;
                });
            }
        };
    });