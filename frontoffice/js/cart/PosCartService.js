angular.module("PosManager")
	.service("PosCartService",
    [
        "PosGlobals",
        "PosGlobalsService",
        "PosCustomersService",
        "PosPlanTypesService",
        "PosPlanTypesDataFactory",
        "PosCustomersDataFactory",
        "PosApiResponseStatusCode",
        "PosModalService",
        "$filter",

        function (
            PosGlobals,
            PosGlobalsService,
            PosCustomersService,
            PosPlanTypesService,
            PosPlanTypesDataFactory,
            PosCustomersDataFactory,
            PosApiResponseStatusCode,
            PosModalService,
            $filter
            )
        {

	        "use strict";
	        
	        var _currentSale = {};
	        var _tempCustomer = {};
	        var _allPlanTypes = [];
	        var _offerableProducts = [];

	        var InitCurrentSelectedCustomer = function ()
	        {
	            _currentSale.SelectedCustomer = {};
	            _currentSale.SelectedCustomer.Name = "Unknown";
	            _currentSale.SelectedCustomer.AddedProducts = [];
	            _currentSale.SelectedCustomer.BonusOfferedProducts = [];
	            _currentSale.SelectedCustomer.AddedPackages = [];
	            _currentSale.SelectedCustomer.AddedPlans = [];
	            _currentSale.SelectedCustomer.Plans = [];
	            _currentSale.SelectedCustomer.AppliedPlans = [];
	        };



	        var InitTempCustomer = function () {
	            _tempCustomer = {};
	            _tempCustomer.AvailableToAddPlanTypes = [];
	        };



	        var InitCart = function ()
	        {
	            InitTempCustomer();
	            InitCurrentSelectedCustomer();

	            _currentSale.DiscountsAmount = 0;
	            _currentSale.SubTotalAmount = 0;
	            _currentSale.TotalAmount = 0;
	        };

            // initialize Cart
	        InitCart();



	        var ResetTempCustomer = function ()
	        {
	            var AvailableToAddPlanTypesLength = _tempCustomer.AvailableToAddPlanTypes.length;
	            while (AvailableToAddPlanTypesLength--) {
	                _tempCustomer.AvailableToAddPlanTypes.pop();
	            }

	            InitTempCustomer();
	        };



	        var ResetCurrentCustomerAddedPlans = function ()
	        {
	            var AddedPlansLength = _currentSale.SelectedCustomer.AddedPlans.length;
	            while (AddedPlansLength > 0) {
	                AddedPlansLength--;
	                RemovePlanFromCart(_currentSale.SelectedCustomer.AddedPlans[AddedPlansLength]);
	            }
	        };



	        var ResetCurrentCustomerPlans = function ()
	        {
	            var plansLength = _currentSale.SelectedCustomer.Plans.length;
	            while (plansLength--) {
	                _currentSale.SelectedCustomer.Plans.pop();
	            }
	        };



	        var ResetCurrentCustomerAppliedPlans = function ()
	        {
	            var AppliedPlansLength = _currentSale.SelectedCustomer.AppliedPlans.length;
	            while (AppliedPlansLength > 0) {
	                AppliedPlansLength--;
	                _currentSale.SelectedCustomer.AppliedPlans.pop();
	            }
	        };



	        var ResetCurrentCustomerAddedProducts = function ()
	        {
	            var AddedProductsLength = _currentSale.SelectedCustomer.AddedProducts.length;
	            while (AddedProductsLength > 0) {
	                AddedProductsLength--;
	                _currentSale.SelectedCustomer.AddedProducts[AddedProductsLength].Count = 0;
	                _currentSale.SelectedCustomer.AddedProducts.pop();
	            }
	        };



	        var ResetCurrentCustomerBonusOfferedProducts = function () {
	            var BonusOfferedProductsLength = _currentSale.SelectedCustomer.BonusOfferedProducts.length;
	            while (BonusOfferedProductsLength > 0) {
	                BonusOfferedProductsLength--;
	                _currentSale.SelectedCustomer.BonusOfferedProducts[BonusOfferedProductsLength].Count = 0;
	                _currentSale.SelectedCustomer.BonusOfferedProducts.pop();
	            }
	        };



	        var ResetCurrentCustomerAddedPackages = function () {
	            var AddedPackagesLength = _currentSale.SelectedCustomer.AddedPackages.length;
	            while (AddedPackagesLength > 0) {
	                AddedPackagesLength--;
	                _currentSale.SelectedCustomer.AddedPackages[AddedPackagesLength].Count = 0;
	                _currentSale.SelectedCustomer.AddedPackages.pop();
	            }
	        };



	        var ResetCurrentSelectedCustomer = function ()
	        {
	            ResetCurrentCustomerAddedProducts();
	            ResetCurrentCustomerBonusOfferedProducts();
	            ResetCurrentCustomerAddedPackages();
	            ResetCurrentCustomerAddedPlans();
	            ResetCurrentCustomerPlans();
	            ResetCurrentCustomerAppliedPlans();

	            InitCurrentSelectedCustomer();
	        };



	        var ReinitialiseCart = function ()
	        {
	            ResetTempCustomer();
	            ResetCurrentSelectedCustomer();
	            ResetAllOfferableProducts();

	            _currentSale.DiscountsAmount = 0;
	            _currentSale.SubTotalAmount = 0;
	            _currentSale.TotalAmount = 0;
	        };



	        var ResetAllOfferableProducts = function () {
	            _offerableProducts = PosGlobalsService.GetAllOfferableProducts();
	        };



	        var ResetDiscountsAmount = function ()
	        {
	            _currentSale.DiscountsAmount = 0;
	            UpdateTotalAmount();
	        };
            


            // To be improved
	        var UpdateDiscounts = function ()
	        {
	            ResetDiscountsAmount();
	            ResetCurrentCustomerAppliedPlans();

	            if (_currentSale.SelectedCustomer.AddedProducts.length === 0)
	            {
	                console.log("No products in cart, nothing to do!");
	                return;
	            }

	            if (!SelectedCustomerHasPlans())
	            {
	                //ResetDiscountsAmount();
	                //ResetCurrentCustomerAppliedPlans();
	                console.log("Customers has got no plans in cart, nothing to do!");
	                return;
	            }

	            //ResetDiscountsAmount();
	            //ResetCurrentCustomerAppliedPlans();

	            var PlansCopy = [];
	            var AddedPlansCopy = [];
	            var AllPlans = [];
	            var currAppliedPlan = {};

	            PlansCopy.length = 0;
	            AddedPlansCopy.length = 0;

	            PlansCopy = angular.copy(_currentSale.SelectedCustomer.Plans);
	            AddedPlansCopy = angular.copy(_currentSale.SelectedCustomer.AddedPlans);
	            AllPlans = PlansCopy.concat(AddedPlansCopy);

	            for (var i = 0; i < _currentSale.SelectedCustomer.AddedProducts.length; i++)
	            {
	                var IsDiscountApplied = false;
	                var currProduct = _currentSale.SelectedCustomer.AddedProducts[i];

	                for (var j = 0; j < AllPlans.length && !IsDiscountApplied; j++)
	                {
	                    if (AllPlans[j].PlanType.Product.Id === currProduct.Id
                            && AllPlans[j].RoundsCounter > 0)
	                    {
	                        AddToDiscountsAmount(currProduct.Price);

	                        AllPlans[j].RoundsCounter--;
	                        _currentSale.SelectedCustomer.AppliedPlans.push(AllPlans[j]);;

	                        IsDiscountApplied = true;
	                        break;
	                    }
	                }
	            }

	            console.log("_currentSale.SelectedCustomer.AppliedPlans", _currentSale.SelectedCustomer.AppliedPlans);
	        };
            

	        var AddPlanToAppliedPlans = function (plan)
	        {
	            for (var i = 0; i < _currentSale.SelectedCustomer.AppliedPlans.length; i++) {
	                if (_currentSale.SelectedCustomer.AppliedPlans[i].Id === plan.Id) {
	                    console.log("Plan already in current AppliedPlans!");
	                    plan.Count++;
	                    return;
	                }
	            }

	            plan.Count++;
	            _currentSale.SelectedCustomer.AppliedPlans.push(plan);
	        };



	        var SelectedCustomerHasPlans = function ()
	        {
	            return (_currentSale.SelectedCustomer.Plans.length > 0
                        || _currentSale.SelectedCustomer.AddedPlans.length > 0);
	        };



	        var PopulateAllPlanTypes = function (callback)
	        {
	            PosPlanTypesDataFactory.GetAllPlanTypes().then(
                    function (response) {
                        _allPlanTypes = response.data.ApiResult;

                        if (typeof (callback) === "function") {
                            callback();
                        }
                    },
                    function (error) { }
               );
	        }

            

	        var LoadTempCustomerAvailableToAddPlanTypes = function (params, callback)
	        {
	            ResetTempCustomer();

	            LoadCustomerDetails(params, function (customer) {

	                angular.extend(_tempCustomer, customer);

	                _allPlanTypes = PosGlobalsService.GetAllPlanTypes();

	                PopulateCurrentAvailableToAddPlanTypes(callback)
	            });
	        };



	        var PopulateCurrentAvailableToAddPlanTypes = function (callback)
	        {
	            if (typeof (_tempCustomer.Plans) === "undefined") {
	                console.log("_tempCustomer.Plans undefined!");
	                //return;
	            }
                
	            _tempCustomer.AvailableToAddPlanTypes = angular.copy(_allPlanTypes);

	            if (_tempCustomer.Plans.length == 0) {
	                console.info("Current Customer has 0 Plans");
	                //return;
	            }
	            else {
	                var i = _allPlanTypes.length;
	                while (i--) {
	                    for (var k = 0; k < _tempCustomer.Plans.length; k++) {

	                        if (_tempCustomer.Plans[k].PlanType.Id == _allPlanTypes[i].Id) {

	                            var indexOfPlanTypeToRemove = Pos.Utils.IndexOfObjectInArrayCheckedById(
                                    _tempCustomer.AvailableToAddPlanTypes,
                                    _allPlanTypes[i]
                                );

	                            if(indexOfPlanTypeToRemove != -1){
	                                _tempCustomer.AvailableToAddPlanTypes.splice(indexOfPlanTypeToRemove, 1);
	                            }
	                        }
	                    }
	                }
	            }

	            if (typeof (callback) === "function")
	            {
	                callback();
	            }
	        };



	        var LoadCustomerDetails = function (params, callback)
	        {
	            PosCustomersDataFactory.GetCustomerById(params.searchResult.Id).then(
                    function success(response) {
                        if (response.data.ApiResponseStatusCode === PosApiResponseStatusCode.Success) {
                            callback(response.data.ApiResult);
                        }
                        else if (response.data.ApiResponseStatusCode === PosApiResponseStatusCode.CRUDoperationError) {
                            PosModalService.showModal(
                                {
                                    templateUrl: "templates/common/NotificationFailure.html"
                                },
                                {
                                    headerText: "customers.TITLE_CUSTOMER_DETAILS",
                                    delay: 3000,
                                    bodyText: "customers.ERROR_GET_CUSTOMER"
                                },
                                true);
                        }
                    },
                    function error(response) {
                        console.log("GetCustomerById Error");
                    });
	        };
	        


	        var SetCurrentSelectedCustomer = function (params, callback)
	        {
	            if (params.searchResult.Id === _currentSale.SelectedCustomer.Id)
	            {
	                console.log("Customer is already Selected!");
	                return;
	            }

	            LoadCustomerDetails(params, function (customer) {
	                SetCurrentCustomer(customer);

	                if (typeof (callback) === "function") {
	                    callback();
	                }
	            });
	        };



	        var SetAnonymousAsCurrentSelectedCustomer = function ()
	        {
	            PosCustomersDataFactory.GetCustomerById(PosGlobals.AnonymousCustomerId).then(
                    function success(response) {
                        if (response.data.ApiResponseStatusCode === PosApiResponseStatusCode.Success)
                        {
                            SetCurrentCustomer(response.data.ApiResult);
                        }
                        else if (response.data.ApiResponseStatusCode === PosApiResponseStatusCode.CRUDoperationError) {
                            PosModalService.showModal(
                                {
                                    templateUrl: "templates/common/NotificationFailure.html"
                                },
                                {
                                    headerText: "customers.TITLE_CUSTOMER_DETAILS",
                                    delay: 3000,
                                    bodyText: "customers.ERROR_GET_CUSTOMER"
                                },
                                true);
                        }
                    },
                    function error(response) {
                        console.log("GetCustomerById Error");
                    });
	        };



	        var SetTempCustomerAsCurrentSelected = function ()
	        {
	            SetCurrentCustomer(_tempCustomer);
	        };
	        


	        var SetCurrentCustomer = function (customer)
	        {
	            ResetCurrentCustomerAddedPlans();
	            ResetCurrentCustomerPlans();
	            angular.extend(_currentSale.SelectedCustomer, customer);
	            UpdateDiscounts();
	        };
            


	        var AddToSubTotalAmount = function (price)
	        {
	            _currentSale.SubTotalAmount = _currentSale.SubTotalAmount + price;
	            UpdateTotalAmount();
	        };



	        var SubstractFromSubTotalAmount = function (price)
	        {
	            _currentSale.SubTotalAmount = _currentSale.SubTotalAmount - price;
	            UpdateTotalAmount();
	        };


	        var AddToDiscountsAmount = function (price)
	        {
	            _currentSale.DiscountsAmount = _currentSale.DiscountsAmount + price;
	            UpdateTotalAmount();
	        };



	        var SubstractFromDiscountsAmount = function (price)
	        {
	            _currentSale.DiscountsAmount = _currentSale.DiscountsAmount - price;
	            UpdateTotalAmount();
	        };



	        var UpdateTotalAmount = function () {
	            _currentSale.TotalAmount = (_currentSale.SubTotalAmount - _currentSale.DiscountsAmount);
	        };



	        var GetTotalAmount = function ()
	        {
	            return _currentSale.TotalAmount;
	        };



            /** format the price of a product, plan .. etc,
             *  to a double value understandable for javascript calculation
             *  operations
             */
	        var FormatItemPrice = function (item)
	        {
	            if (item && item.Price)
	                item.Price = parseFloat(item.Price);
	        }



	        var PrepareItemToCart = function (item)
	        {
	            FormatItemPrice(item);

	            if (!item.Count)
	                item.Count = 0;
	        }



	        var BuildPlanFromPlanType = function (planType)
	        {
	            return {
	                PlanType: planType,
	                RoundsCounter: planType.Rounds
	                //Customer: _currentSale.SelectedCustomer,
	            };
	        }


	        var _planTypeIsInArray = function (array, planType)
	        {
	            var i = array.length;
	            while (i--) {
	                if (array[i].PlanType.Name === planType.Name) {
	                    return true;
	                }
	            }
	            return false;
	        }


	        var AddPlanToCart = function (planType)
	        {
	            if (!planType.Name) {
	                console.info("No PlanType has been  Selected!");
	                return;
	            }

	            if (_planTypeIsInArray(_currentSale.SelectedCustomer.AddedPlans, planType)) {
	                console.info("PlanType already in current Cart!");
	                return;
	            }

	            if (_planTypeIsInArray(_currentSale.SelectedCustomer.Plans, planType)) {
	                console.info("PlanType already in current Customer!");
	                return;
	            }

	            if (_tempCustomer.Id !== _currentSale.SelectedCustomer.Id) {
	                SetTempCustomerAsCurrentSelected();
	            }

	            PrepareItemToCart(planType);
	            _currentSale.SelectedCustomer.AddedPlans.push(BuildPlanFromPlanType(planType));
	            AddToSubTotalAmount(planType.Price);
	            UpdateDiscounts();
	        };



	        var RemovePlanFromCart = function (plan)
	        {
	            var indexOfplan = _currentSale.SelectedCustomer.AddedPlans.indexOf(plan);

	            if (indexOfplan === -1) {
	                console.log("Plan doesn't exist in _currentSale.SelectedCustomer.AddedPlans array!");
	                return;
	            }

	            SubstractFromSubTotalAmount(plan.PlanType.Price);
	            _currentSale.SelectedCustomer.AddedPlans.splice(indexOfplan, 1);
	            UpdateDiscounts();
	        };



            var AddProduct = function (product)
            {
                PrepareItemToCart(product);
                product.Count++;

                _currentSale.SelectedCustomer.AddedProducts.push(product);
                UpdateDiscounts();

                AddToSubTotalAmount(product.Price);
                RemoveBonusOfferedProduct(product);
                RemoveFromOfferableProducts(product.Id);
            };



            var RemoveProduct = function (product)
            {
                var indexOfToRemoveProduct = _currentSale.SelectedCustomer.AddedProducts.indexOf(product);

                if (indexOfToRemoveProduct === -1)
                {
                    console.info("Product doesn't exist in AddedProducts array!");
                    return;
                }

                SubstractFromSubTotalAmount(product.Price);
                product.Count--;

                _currentSale.SelectedCustomer.AddedProducts.splice(indexOfToRemoveProduct, 1);
                UpdateDiscounts();

                if (product.Count < 1) {
                    AddToOfferableProducts(product);
                }
            };



            var ProductIdIsInCart = function (productId)
            {
                var isInCart = false;

                for (var i = 0; i < _currentSale.SelectedCustomer.AddedProducts.length; i++) {
                    if (_currentSale.SelectedCustomer.AddedProducts[i].Id === productId) {
                        isInCart = true;
                        break;
                    }
                }

                for (var j = 0; j < _currentSale.SelectedCustomer.BonusOfferedProducts.length; j++) {
                    if (_currentSale.SelectedCustomer.BonusOfferedProducts[j].ProductId === productId) {
                        isInCart = true;
                        break;
                    }
                }

                return isInCart;
            };

            var RemoveFromOfferableProducts = function (productId) {

                var indexOfProduct = Pos.Utils.IndexOfIdInArray(_offerableProducts, productId);

                if (indexOfProduct > -1) {
                    _offerableProducts.splice(indexOfProduct, 1);
                    console.info("AddToOfferableProducts --> Removing product with id " + productId + " from _offerableProducts array");
                }
            };

            var AddToOfferableProducts = function (product)
            {
                var allOfferableProducts = PosGlobalsService.GetAllOfferableProducts();
                var indexInAllOfferable = Pos.Utils.IndexOfObjectInArrayCheckedById(allOfferableProducts, product);
                var indexInCurrOfferable = Pos.Utils.IndexOfObjectInArrayCheckedById(_offerableProducts, product);

                // if doesn't exits in AllOfferable, cannot offer it, do nothing
                if (indexInAllOfferable === -1) {
                    return;
                }

                // if already exits, do nothing
                if (indexInCurrOfferable > -1) {
                    return;
                }

                console.info("AddToOfferableProducts --> Adding product " + product.Name + " to _offerableProducts array");

                // else add it
                _offerableProducts.push(angular.copy(product));
            };



            var AddBonusOfferedProduct = function (bonusProduct)
            {
                if (ProductIdIsInCart(bonusProduct.ProductId)) {
                    console.info("Selected product is already in cart, cannot offer it");
                    return;
                }

                _currentSale.SelectedCustomer.BonusOfferedProducts.push(bonusProduct);
                RemoveFromOfferableProducts(bonusProduct.ProductId);
            };



            var RemoveBonusOfferedProduct = function (product)
            {
                var indexOfProduct = -1;
                if (_currentSale.SelectedCustomer.BonusOfferedProducts.length > 0) {

                    var i = _currentSale.SelectedCustomer.BonusOfferedProducts.length;

                    while (i--) {
                        if (
                            typeof (_currentSale.SelectedCustomer.BonusOfferedProducts[i].ProductId) !== "undefined" &&
                            _currentSale.SelectedCustomer.BonusOfferedProducts[i].ProductId === product.Id
                            ) {
                            indexOfProduct = i;
                            break;
                        }
                    }
                }

                if (indexOfProduct === -1) {
                    console.log("BonusOfferedProduct doesn't exist in BonusOfferedProducts array!");
                    return;
                }

                _currentSale.SelectedCustomer.BonusOfferedProducts.splice(indexOfProduct, 1);
                AddToOfferableProducts(product);
            };



            var AddPackage = function (pckg)
            {
                PrepareItemToCart(pckg);
                pckg.Count++;

                _currentSale.SelectedCustomer.AddedPackages.push(pckg);

                AddToSubTotalAmount(pckg.Price);
            };



            var RemovePackage = function (pckg) {
                var indexOfToRemovePackage = _currentSale.SelectedCustomer.AddedPackages.indexOf(pckg);

                if (indexOfToRemovePackage === -1) {
                    console.log("Package doesn't exist in AddedPackages array!");
                    return;
                }

                SubstractFromSubTotalAmount(pckg.Price);
                pckg.Count--;
                _currentSale.SelectedCustomer.AddedPackages.splice(indexOfToRemovePackage, 1);
            };



            var IsCurrentSaleOperationValid = function ()
            {
                var isValid = true;

                if (typeof (_currentSale) === "undefined" ||
                    typeof (_currentSale.SelectedCustomer) === "undefined" ||
                    typeof (_currentSale.SelectedCustomer.Id) === "undefined" ||
                    (
                        typeof (_currentSale.SelectedCustomer.AddedPackages) === "undefined" &&
                        typeof (_currentSale.SelectedCustomer.AddedPlans) === "undefined" &&
                        typeof (_currentSale.SelectedCustomer.AddedProducts) === "undefined" &&
                        typeof (_currentSale.SelectedCustomer.BonusOfferedProducts) === "undefined"
                    )
                )
                {
                    isValid = false;
                }

                return isValid;
            };



            var BuildCurrentSaleOperationObj = function ()
            {
                var currSaleObj = new Object();

                currSaleObj.Amount = GetTotalAmount();
                currSaleObj.IsPaid = true;
                currSaleObj.CustomerId = _currentSale.SelectedCustomer.Id;
                currSaleObj.UserId = 12;

                currSaleObj.AddedPackages = _currentSale.SelectedCustomer.AddedPackages;
                currSaleObj.AddedProducts = _currentSale.SelectedCustomer.AddedProducts;
                currSaleObj.BonusOfferedProducts = _currentSale.SelectedCustomer.BonusOfferedProducts;
                currSaleObj.AddedPlans = _currentSale.SelectedCustomer.AddedPlans;
                currSaleObj.Plans = _currentSale.SelectedCustomer.Plans;

                return currSaleObj;
            };



            return {
	            AddProduct: function (product)
	            {
	                AddProduct(product);
	            },

	            RemoveProduct: function (product)
	            {
	                RemoveProduct(product);
	            },

	            AddBonusOfferedProduct: function (BonusOfferedProduct)
	            {
	                AddBonusOfferedProduct(BonusOfferedProduct);
	            },

	            RemoveBonusOfferedProduct: function (BonusOfferedProduct)
	            {
	                RemoveBonusOfferedProduct(BonusOfferedProduct);
	            },

	            GetOfferableProducts: function ()
	            {
	                return _offerableProducts;
	            },

	            SetCartAllOfferableProducts: function () {
	                _offerableProducts = PosGlobalsService.GetAllOfferableProducts();
	            },

	            AddPackage: function (pckg)
	            {
	                AddPackage(pckg);
	            },

	            RemovePackage: function (pckg)
	            {
	                RemovePackage(pckg);
	            },

	            AddPlanToCart: function (planType)
	            {
	                AddPlanToCart(planType);
	            },

	            RemovePlanFromCart: function (planType) {
	                RemovePlanFromCart(planType);
	            },

	            GetAllCurrentProducts: function ()
	            {
	                return _currentSale.SelectedCustomer.AddedProducts;
	            },

	            GetAllCurrentBonusOfferedProducts: function ()
	            {
	                return _currentSale.SelectedCustomer.BonusOfferedProducts;
	            },

	            GetAllCurrentPackages: function () {
	                return _currentSale.SelectedCustomer.AddedPackages;
	            },

	            GetDiscountsAmount: function ()
	            {
	                return _currentSale.DiscountsAmount.toFixed(2);
	            },

	            GetSubTotalAmount: function ()
	            {
	                return _currentSale.SubTotalAmount.toFixed(2);
	            },

	            GetPriceToPay: function ()
	            {
	                return GetTotalAmount().toFixed(2);;
	            },

	            LoadAvailableToAddPlanTypes: function (params, callback) {
	                LoadTempCustomerAvailableToAddPlanTypes(params, callback);
	            },

	            GetAllPlanTypes: function () {
	                return _allPlanTypes;
	            },

	            PopulateAllPlanTypes: function () {
	                PopulateAllPlanTypes();
	            },

	            GetAddedPlans: function ()
	            {
	                return _currentSale.SelectedCustomer.AddedPlans;
	            },
                
	            GetAppliedPlans: function ()
	            {
	                return _currentSale.SelectedCustomer.AppliedPlans;
	            },

	            SetCurrentSelectedCustomer: function (params, callback)
	            {
	                SetCurrentSelectedCustomer(params, callback);
	            },

	            SetAnonymousAsCurrentSelectedCustomer : function(){
	                SetAnonymousAsCurrentSelectedCustomer();
	            },

	            GetCurrentSelectedCustomer: function () {
	                return _currentSale.SelectedCustomer;
	            },

	            ResetCurrentSelectedCustomer: function () {
	                ResetCurrentSelectedCustomer();
	            },

	            ReinitialiseCart: function () {
	                ReinitialiseCart();
	            },

	            GetTempCustomer: function () {
	                return _tempCustomer;
	            },

	            GetCurrentSale: function () {
	                return _currentSale;
	            },

	            IsCartEmpty: function () {
	                return !(_currentSale.SelectedCustomer.AddedPackages.length > 0 ||
                            _currentSale.SelectedCustomer.AddedProducts.length > 0 ||
                            _currentSale.SelectedCustomer.BonusOfferedProducts.length > 0 ||
                            _currentSale.SelectedCustomer.AddedPlans.length > 0
                        );
	            },

	            IsCurrentSaleOperationValid: function()
	            {
	                return IsCurrentSaleOperationValid();
	            },

	            BuildCurrentSaleOperationObj : function()
	            {
	                return BuildCurrentSaleOperationObj();
	            }
	        }
	    }]);