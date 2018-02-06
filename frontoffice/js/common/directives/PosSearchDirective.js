angular.module("PosManager")
	.directive("posSearch",
    [
        "$rootScope",
        "$http",
        "$document",
        "$filter",
        "PosGlobals",

        function ($rootScope, $http, $document, $filter, PosGlobals) {
	        return {
	            restrict: "EA",
	            replace: true,
	            transclude: true,
	            templateUrl: "templates/common/directives/SearchComponent.html",

	            scope: {
	                searchTerm: "=",
	                searchMode: "@searchMode",
	                staticSearchList: "=",
	                searchPropertyKey: "@",
	                searchUrl: "=",
	                searchInputPlaceholderText: "@",
	                searchInputIconType: "@",
	                currSearchResultsList: "=",
	                onClickEditBtn: "&",
	                onClickViewBtn: "&",
	                onClickSelectSearchResult: "&",
	                onClickEditPlansBtn: "&",
	                formatSearchResult: "&",
	                onPressEnterOnSearchResultItem: "&"
	            },

	            link: function (scope, element, attrs)
	            {
	                scope.SearchResults = {};
	                scope.InfructuousTerms = [];
	                scope.InputHasFocus = false;

	                scope.KeyboardFocusIndex = 0;
	                scope.KeyboardSelectedItem = {title:"Prince"};

	                scope.$watch("SearchTermModel",
                        function (term) {
                            if (!!term && (scope.InfructuousTerms.indexOf(term) == -1)) {
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

	                        if (!!scope.SearchTermModel)
	                        {
	                            EmptySearchField();
	                        }
	                    }
	                    else
	                    {
	                        ShowSearchResultsBox();
	                    }
	                });

	                // reset the infructuous terms list
	                // should be updated, since it empties the infructuous list
	                // for everywhere search component directive is used
	                scope.$on("reset-search-list-infructuous", function () {
	                    scope.InfructuousTerms = [];
	                });

	                element.on("mouseenter", function () {
                        scope.InputHasFocus = true;
	                });

	                element.on("mouseleave", function () {
	                    scope.InputHasFocus = false;
	                });

	                $document.bind("keydown", function (e) {
	                    if (scope.InputHasFocus && !!scope.SearchTermModel) {
	                        // up
	                        if (e.keyCode == 38) {

	                            console.info("pressed up key");

	                            if (scope.KeyboardFocusIndex == 0) {
	                                return;
	                            }

	                            scope.$apply(function () {
	                                scope.KeyboardFocusIndex--;
	                            });
	                            e.preventDefault();
	                        }

                            // down
	                        if (e.keyCode == 40) {

	                            console.info("pressed down key");

	                            if (scope.KeyboardFocusIndex == scope.CurrentSearchResultsList.length - 1) {
	                                return;
	                            }
	                            
	                            scope.$apply(function(){
	                                scope.KeyboardFocusIndex++;
	                            });
	                            e.preventDefault();
	                        }

                            // enter
	                        //if (e.keyCode == 13) {
	                        //    console.info("pressed enter key");
	                        //    if (typeof (scope.onPressEnterOnSearchResultItem) === "function") {

	                        //        console.info("On to executing onPressEnterOnSearchResultItem");

	                        //        scope.$apply(function () {
	                        //            scope.onPressEnterOnSearchResultItem(scope.KeyboardSelectedItem);
	                        //        });
	                        //    }
	                        //    e.preventDefault();
	                        //}
	                    }
	                });


                    // internal functions
	                function UpdateSearchResults(term)
	                {	                
	                    if (term in scope.SearchResults)
	                    {
	                        scope.CurrentSearchResultsList = scope.SearchResults[term];
	                    }
	                    else
	                    {
	                        if (scope.searchMode === "dynamic")
	                        {
	                            console.log("search is dynamic");

	                            $http({
	                                url: scope.searchUrl,
	                                method: "GET",
	                                params: {
	                                    Term: term
	                                }
	                            })
                                .then(
                                    function (response) {
                                        UpdateSearchResultsData(term, response.data.ApiResult);
                                    },
                                    function (error) {
                                        return;
                                    }
                                );
	                        }
	                        if (scope.searchMode === "static")
	                        {
	                            console.log("search is static");

	                            UpdateSearchResultsData(term, GetFromStaticList(scope.searchPropertyKey, term));
	                        }
	                    }
	                }

	                function UpdateSearchResultsData(term, currSortedResultsList)
	                {
	                    if (currSortedResultsList.length > 0) {
	                        scope.SearchResults[term] = currSortedResultsList;
	                        scope.CurrentSearchResultsList = currSortedResultsList;
	                    }
	                    else {
	                        scope.InfructuousTerms.push(term);
	                        scope.CurrentSearchResultsList = [];
	                    }
	                }

	                // search for term and return sorted result
	                function GetFromStaticList(key, term)
	                {
	                    var resultsList = [];
	                    var lowerTerm = term.toLowerCase();

	                    for (var i = 0 ; i < scope.staticSearchList.length; i++) {
	                        var lowerAct = scope.staticSearchList[i][key].toLowerCase();

	                        if (lowerAct.indexOf(lowerTerm) === 0 || lowerAct.indexOf(lowerTerm) !== -1) {
	                            resultsList.push(scope.staticSearchList[i])
	                        }
	                    }

	                    return resultsList.sort(OrderBy(key, term));
	                }

	                function OrderBy(key, term) {
	                    return function (a, b) {
	                        var bgnA = a[key].substring(0, term.length).toLowerCase();
	                        var bgnB = b[key].substring(0, term.length).toLowerCase();

	                        if (bgnA == term.toLowerCase()) {
	                            if (bgnB != term.toLowerCase()) return -1;
	                        }
	                        else if (bgnB == term.toLowerCase()) return 1;

	                        return a[key] < b[key] ? -1 : (a[key] > b[key] ? 1 : 0);
	                    }
	                }


	                function HideSearchResultsBox() {
	                    element.find("#search-results-list").css({ display: "none" });
	                }

	                function ShowSearchResultsBox() {
	                    element.find("#search-results-list").css({ display: "block" });
	                }

	                function EmptySearchField() {
	                    scope.$apply(function (){
	                        scope.SearchTermModel = null;
	                    });
	                }
	            }
	        };
	    }]);

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