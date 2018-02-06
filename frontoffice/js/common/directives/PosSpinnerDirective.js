angular.module("PosManager")
	.directive("posSpinner", 
    [
        "$timeout",


        function ($timeout)
	    {
		    return {
			    restrict: "EA",
			    replace: true,
			    transclude: true,
			    templateUrl: "templates/common/directives/Spinner.html",
			    scope: {
			        show: "=?",
			        delay: "@?",
			    },
						
			    link: function (scope, elem, attrs)
			    {
			        var timeoutID;
			        var currActionInProgress;

			        //This is where all the magic happens!
				    // Whenever the scope variable updates we simply
				    // show if it evaluates to 'true' and hide if 'false'
			        scope.$watch("show", function (newVal, oldVal)
			            {
			                currActionInProgress = newVal;
				            (newVal === true) ? showSpinner() : tryHideSpinner();
				        },
                        true
                    );

				    function showSpinner(target)
				    {
					    //If showing is already in progress just wait
					    if (timeoutID) return;

					    //Set up a timeout based on our configured delay to show
					    // the element (our spinner)
				        //showTimer = $timeout(showElement.bind(elem, true), getDelay());

					    elem.css({ display: "block" });

					    var delay = getDelay();
					    timeoutID = setTimeout(hideSpinner, delay);
				    }

				    function hideSpinner()
				    {
				        // quit only if show == false
				        //if (currActionInProgress === true) {
				        //    return;
				        //}

					    //This is important. If the timer is in progress
					    // we need to cancel it to ensure everything stays
					    // in sync.
					    if (timeoutID) {
						    clearTimeout(timeoutID);
					    }
					    timeoutID = null;
                        
					    elem.css({ display: "none" });

					    scope.$apply(function ()
					    {
						    scope.$root.actionCompleted = true;
					    });
				    }

				    function tryHideSpinner()
				    {
				        if ((typeof (timeoutID) !== "undefined" && !timeoutID)) // || !currActionInProgress)
					    {
					        hideSpinner();
					    }
				    }

				    function getDelay()
				    {
					    var delay = parseInt(scope.delay);

					    return isNaN(delay) ? 200 : delay;
				    }
			    }
		    };
	    }]);