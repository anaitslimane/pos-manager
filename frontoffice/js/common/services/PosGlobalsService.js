angular.module("PosManager")
	    .service("PosGlobalsService",
        [
            "$http",
            "localStorageService",
            "PosLocaleService",
            "PosGlobals",
            "PosPlanTypesService",
            "PosPlanTypesDataFactory",
            "PosBonusDataFactory",

            function (
                $http,
                localStorageService,
                PosLocaleService,
                PosGlobals,
                PosPlanTypesService,
                PosPlanTypesDataFactory,
                PosBonusDataFactory
                )
            {

                "use strict";

                var _countries = [];
	            var _allProducts = {};
	            var _allOfferableProducts = [];
	            var _allPackages = {};
	            var _allPlanTypes = [];
	            var _allBonusTypes = [];

	            var _populateCountries = function () {
	                return $http.get(PosGlobals.urls.api.getAllCountries).then(
                        function (response) {
                            _countries = response.data.ApiResult;

                            var lang = PosLocaleService.getCurrentLocale().substring(0, 2);

                            localStorageService.set("PosCountries" + lang, _countries);
                            console.info("PosGlobalsService -> PosCountries" + lang + " saved into local storage");
                        },
                        function (error) {
                            console.error("PosGlobalsService -> Error while loading Countries");
                        }
                    );
	            };

	            var _populateAllProducts = function () {
	                return $http.get(PosGlobals.urls.api.getAllProducts).then(
                        function (response) {
                            _allProducts = response.data.ApiResult;

                            localStorageService.set("PosAllProducts", _allProducts);
                            console.info("PosGlobalsService -> PosAllProducts saved into local storage");
                        },
                        function (error) {
                            console.error("PosGlobalsService -> Error while loading Products");
                        }
                    );
	            };

	            var _populateAllOfferableProducts = function () {
	                return $http.get(PosGlobals.urls.api.getAllOfferableProducts).then(
                        function (response) {
                            _allOfferableProducts = response.data.ApiResult;

                            localStorageService.set("PosAllOfferableProducts", _allOfferableProducts);
                            console.info("PosGlobalsService -> PosAllOfferableProducts saved into local storage");
                        },
                        function (error) {
                            console.error("PosGlobalsService -> Error while loading AllOfferableProducts");
                        }
                    );
	            };

	            var _populateAllPackages = function () {

	                return $http.get(PosGlobals.urls.api.getAllPackages).then(
                        function (response) {
                            _allPackages = response.data.ApiResult;

                            localStorageService.set("PosAllPackages", _allPackages);
                            console.info("PosGlobalsService -> PosAllPackages saved into local storage");
                        },
                        function (error) {
                            console.error("PosGlobalsService -> Error while loading Packages");
                        }
                    );
	            };

	            var _populateAllPlanTypes = function () {

	                return PosPlanTypesDataFactory.GetAllPlanTypes().then(
                        function (response) {
                            _allPlanTypes = response.data.ApiResult;
                            
                            localStorageService.set("PosAllPlanTypes", _allPlanTypes);
                            console.info("PosGlobalsService -> PosAllPlanTypes saved into local storage");
                        },
                        function (error) {
                            console.error("PosPlanTypesService -> Error while loading PlanTypes");
                        }
                    );
	            };

	            var _populateAllBonusTypes = function () {

	                return PosBonusDataFactory.GetAllBonusTypes().then(
                        function (response) {
                            _allBonusTypes = response.data.ApiResult;

                            localStorageService.set("PosAllBonusTypes", _allBonusTypes);
                            console.info("PosGlobalsService -> PosAllBonusTypes saved into local storage");
                        },
                        function (error) {
                            console.error("PosPlanTypesService -> Error while loading BonusTypes");
                        }
                    );
	            };

	            var _getCountries = function () {
	                var lang = PosLocaleService.getCurrentLocale().substring(0, 2);
	                var _countries = localStorageService.get("PosCountries" + lang);

	                if (!_countries) {
	                    _populateCountries();
	                }

	                return _countries;
	            };

	            var _getAllPackages = function () {
	                var _allPackages = localStorageService.get("PosAllPackages");

	                if (!_allPackages) {
	                    _populateAllPackages();
	                }

	                return _allPackages;
	            };

	            var _getAllProducts = function () {
	                var _allProducts = localStorageService.get("PosAllProducts");

	                if (!_allProducts) {
	                    _populateAllProducts();
	                }

	                return _allProducts;
	            };

	            var _getAllOfferableProducts = function () {
	                var _allOfferableProducts = localStorageService.get("PosAllOfferableProducts");

	                if (!_allOfferableProducts) {
	                    _populateAllOfferableProducts();
	                }

	                return _allOfferableProducts;
	            };

	            var _getAllPlanTypes = function () {
	                var _allPlanTypes = localStorageService.get("PosAllPlanTypes");

	                if (!_allPlanTypes) {
	                    _populateAllPlanTypes();
	                }

	                return _allPlanTypes;
	            };

	            var _getAllBonusTypes = function () {
	                var _allBonusTypes = localStorageService.get("PosAllBonusTypes");

	                if (!_allBonusTypes) {
	                    _populateAllBonusTypes();
	                }

	                return _allBonusTypes;
	            };

	            return {
	                GetCountries: function () {
	                    return _getCountries();
	                },

	                GetAllProducts: function () {
	                    return _getAllProducts();
	                },

	                GetAllOfferableProducts: function () {
	                    return _getAllOfferableProducts();
	                },

	                GetAllPackages: function () {
	                    return _getAllPackages();
	                },

	                GetAllPlanTypes: function () {
	                    return _getAllPlanTypes();
	                },

	                GetAllBonusTypes: function () {
	                    return _getAllBonusTypes();
	                },

	                PopulateAllProducts: function () {
	                    return _populateAllProducts();
	                },

	                PopulateAllPackages: function () {
	                    return _populateAllPackages();
	                },

	                PopulateAllPlanTypes: function () {
	                    return _populateAllPlanTypes();
	                },

	                PopulateAllBonusTypes: function () {
	                    return _populateAllBonusTypes();
	                },

	                LoadAllInitData: function (callback)
	                {
	                    _populateCountries()
	                    .then(_populateAllProducts)
                        .then(_populateAllOfferableProducts)
	                    .then(_populateAllPackages)
                        .then(_populateAllPlanTypes)
                        .then(_populateAllBonusTypes)
                        .then(function () {
                            if (typeof(callback) === "function") {
                                callback();
	                        }
	                    });
	                }
	            };
            }]);


//var _getAllPlanTypes = function () {
//    var _allPlanTypes = localStorageService.get("PosAllPlanTypes");

//    if (_allPlanTypes && _allPlanTypes.length > 0) {
//        return _allPlanTypes;
//    }
//    else {
//        _populateAllPlanTypes().then(function () {
//            return _allPlanTypes;
//        });
//    }
//};

//var _getAllPackages = function () {
//    var _allPackages = localStorageService.get("PosAllPackages");

//    if (_allPackages && _allPackages.length > 0) {
//        return _allPackages;
//    }
//    else {
//        _populateAllPackages().then(function () {
//            return _allPackages;
//        });
//    }
//};

//var _getAllOfferableProducts = function () {
//    var allOfferableProducts = localStorageService.get("PosAllOfferableProducts");

//    if (allOfferableProducts && allOfferableProducts.length > 0) {
//        _allOfferableProducts = allOfferableProducts;
//        return _allOfferableProducts
//    }
//    else {
//        _populateAllOfferableProducts().then(function () {
//            return _allOfferableProducts;
//        });
//    }
//};