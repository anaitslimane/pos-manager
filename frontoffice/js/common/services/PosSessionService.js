angular.module("PosManager")
    .service("PosSessionService",
    [
        "localStorageService",
        "PosCartService",

        function (localStorageService, PosCartService)
        {
            "use strict";

            var _currentUser = {};
            var _lastUser = {};

            var _initSession = function ()
            {
                var currentUser = localStorageService.get("PosCurrentUser");

                if (currentUser) {
                    _currentUser.isAuth = true;
                    _currentUser.username = currentUser.username;
                    _currentUser.name = currentUser.name;
                    _currentUser.familyname = currentUser.familyname;
                    _currentUser.email = currentUser.email;
                    _currentUser.token = currentUser.token;
                }
                else {
                    _resetSession();
                }
            };

            var _resetSession = function ()
            {
                _currentUser = {
                    isAuth: false,
                    username: "",
                    name : "",
                    familyname : "",
                    email : "",
                    token: {}
                };

                localStorageService.remove("PosCurrentUser");

                //PosCartService.SetCartAllOfferableProducts();
            };

            var _setCurrentAuthenticatedUser = function (token, username, name, familyname, email)
            {
                // Verify if connected user is not the same as the last one, empty the cart
                if (_lastUser && _lastUser.username !== username)
                {
                    PosCartService.ReinitialiseCart();
                }

                _currentUser.isAuth = true;
                _currentUser.username = username;
                _currentUser.name = name;
                _currentUser.familyname = familyname;
                _currentUser.email = email;
                _currentUser.token = token;
                localStorageService.set("PosCurrentUser", _currentUser);
                _lastUser = _currentUser;
            };



            return {
                InitSession: function()
                {
                    _initSession();
                },

                GetCurrentUser : function()
                {
                    return _currentUser;
                },

                SetCurrentAuthenticatedUser: function (token, username, name, familyname, email) {
                    _setCurrentAuthenticatedUser(token, username, name, familyname, email);
                },

                ResetSession : function(callback)
                {
                    _resetSession();

                    if (typeof (callback) === "function") {
                        callback();
                    }
                }
            };
    }]);