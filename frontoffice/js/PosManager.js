var PosManager = angular.module("PosManager",
    [
        "ui.router",
        "ui.bootstrap",
        "pascalprecht.translate",
        "tmh.dynamicLocale",
        "ngCookies",
        "ngAnimate",
        "LocalStorageModule"
    ]);

var configFunction = function ($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider)
{

    //$locationProvider.hashPrefix('!').html5Mode(true);

    $translateProvider.useStaticFilesLoader({
        prefix: "resources/translations/translations-", // path to translations files
        suffix: ".json" // suffix, currently- extension of the translations
    });
    $translateProvider.preferredLanguage("fr_DZ"); // is applied on first load
    $translateProvider.useLocalStorage(); // saves selected language to localStorage
    tmhDynamicLocaleProvider.localeLocationPattern("resources/locales/angular/angular-locale_{{locale}}.js");

    $stateProvider.

    // Home
    state("home", {
        url: "/",
        views: {
            "col1": {
                templateUrl: "templates/Welcome.html"
            }
        }
    })

	// Login
    .state("login", {
    	url: "/login",
    	views: {
    		"col1": {
    			templateUrl: "templates/Login.html"
    		}
    	}
    })

    // Customers
    .state("customers/home/", {
        url: "/customers/home/",
        views: {
            "col1": {
                templateUrl: "templates/customers/Home.html"
            }
        },
    })
    .state("customers/add/", {
        url: "/customers/add/",
        views: {
            "col1": {
                templateUrl: "templates/customers/Home.html"
            }
        }
    })
    .state("customers/edit/{customerId}/showForm/", {
        url: "/customers/edit/{customerId}/showForm/",
        views: {
            "col1": {
                templateUrl: "templates/customers/Home.html"
            }
        }
    })
    .state("customers/edit/{customerId}/", {
        url: '/customers/edit/{customerId}/',
        views: {
            "col1": {
                templateUrl: "templates/customers/Home.html"
            }
        }
    })



    // Products
    .state("products/home/", {
        url: "/products/home/",
        views: {
            "col1": {
                templateUrl: "templates/products/Home.html"
            }
        }
    })

    .state("products/offerable/", {
        url: "/products/offerable/",
        views: {
            "col1": {
                templateUrl: "templates/bonus/Offerable.html"
            }
        }
    })



    // Packages
    .state("packages/home/", {
        url: "/packages/home/",
        views: {
            "col1": {
                templateUrl: "templates/packages/Home.html"
            }
        }
    })



    // SALEOPERATIONS
    .state("saleoperations/home/", {
        url: "/saleoperations/home/",
        views: {
            "col1": {
                templateUrl: "templates/saleoperations/Home.html"
            }
        }
    });

    $urlRouterProvider.otherwise("home");
}

configFunction.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider", "$translateProvider", "tmhDynamicLocaleProvider"];

PosManager.config(configFunction);

PosManager.run(
    [
        "$rootScope",
        "$state",
        "$location",
        "$http",
        "PosSessionService",
        "PosAuthenticationService",
        "PosGlobalsService",
        "PosModalService",

        function ($rootScope, $state, $location, $http, PosSessionService, PosAuthenticationService, PosGlobalsService, PosModalService)
        {
            // Lock to handle 'server unreachable' error popup(s)
            $rootScope.UnreachableHandlerLocked = false;

            $rootScope.PreviousState;
            $rootScope.CurrentState;
            $rootScope.$on("$stateChangeSuccess", function (ev, to, toParams, from, fromParams) {
                $rootScope.PreviousState = from.name;
                $rootScope.CurrentState = to.name;
            });

            $rootScope.$on("$locationChangeStart", function (event, next, current) {

                // redirect to login page if not logged in
                if (IsLoginRequired()) {
                    console.info("IsLoginRequired!!!\n");
                    event.preventDefault();
                    SendToLoginPage();
                }
            });

            $rootScope.$on("unauthorized", function () {
                console.info("401 broadcast!!!\n");
                PosSessionService.ResetSession();
                SendToLoginPage();
            });

            $rootScope.$on("server-unreachable", function () {
                console.info("server unreachable!!!\n");

                if (!$rootScope.UnreachableHandlerLocked) {
                    HandleServerUnreachable();
                }
            });
            
            // close bootstrap's navbar if click outside
            $(document).click(function (event) {
                var clickover = $(event.target);
                var _opened = $(".navbar-collapse").is('.navbar-collapse.in.collapse');

                if (_opened === true && !clickover.hasClass("navbar-toggle")) {
                    $("button.navbar-toggle").click();
                }
            });

            var IsLoginRequired = function()
            {
                return ($location.path() !== "/login" &&
                        !PosSessionService.GetCurrentUser().isAuth);
            };

            var SendToLoginPage = function () {
                $state.go("login");
            };

            var HandleServerUnreachable = function () {

                $rootScope.UnreachableHandlerLocked = true;

                // disconnect current user
                if (PosSessionService.GetCurrentUser().isAuth) {
                    PosSessionService.ResetSession(SendToLoginPage);
                }

                PosModalService.showModal(
                    {
                        templateUrl: "templates/common/NotificationFailure.html"
                    },
                    {
                        headerText: "global.ERROR_TITLE_SERVER_UNREACHABLE",
                        delay: 3000,
                        bodyText: "global.ERROR_MSG_SERVER_UNREACHABLE",
                        onCloseCallback: function () {
                            $rootScope.UnreachableHandlerLocked = false;
                        }
                    },
                    true
                );
            };
        }
    ]
);