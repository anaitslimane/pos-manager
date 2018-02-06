function PosLoginController(
    $location,
    $rootScope,
    $state,
    PosAuthenticationService,
    PosGlobalsService,
    PosCartService,
    PosGlobals
    )
{
    var self = this;

    self.StartSpinner = function(){
        $rootScope.actionInProgress = true;
    };

    self.StopSpinner = function () {
        $rootScope.actionInProgress = false;
    };

    self.Login = function ()
    {
        self.StartSpinner();

        PosAuthenticationService.Login(self.username, self.password, function (response)
        {
            if (response.data && !response.data.error)
            {
                self.OnSignInSuccess(self.StopSpinner);
            }
            else
            {
                if (response.data && response.data.error)
                {
                    self.error = response.data.error;
                }
                else {
                    self.error = {};
                }
                self.StopSpinner();
            }
        });
    };

    self.OnClickSignOut = function () {
        console.info("Clicked SignOut Btn");
        PosAuthenticationService.LogOut(function(){
            $state.go("login");
        });
    };

    self.OnClickSignIn = function () {
        $state.go("login");
    };

    self.OnSignInSuccess = function (callback) {
        console.info("SignIn Success");

        self.error = null;

        // load common data right after sign in
        PosGlobalsService.LoadAllInitData(function(){
            self.CallbackAfterLoadingInitialData(callback);
        });
    };

    self.CallbackAfterLoadingInitialData = function (callback) {

        // Load offerable products
        PosCartService.SetCartAllOfferableProducts();

        if ($rootScope.PreviousState in PosGlobals.States) {
            $state.go($rootScope.PreviousState).then(callback);
        }
        else {
            $state.go("home").then(callback);
        }
    };
};

angular.module("PosManager").controller("PosLoginController",
                [
                    "$location",
                    "$rootScope",
                    "$state",
                    "PosAuthenticationService",
                    "PosGlobalsService",
                    "PosCartService",
                    "PosGlobals",
                    PosLoginController
                ]);