function PosCartController(
    $rootScope,
    PosCartDataFactory,
    PosCartService,
    PosSaleOperationsService,
    PosGlobalsService,
    PosCustomersService,
    PosPlanTypesService,
    PosModalService,
    PosGlobals,
    PosUniqueFilter,
    PosApiResponseStatusCode,
    PosHttpHelper,
    $state,
    $timeout)
{
    var self = this;

    self.cartName = "";
    self.CartService = PosCartService;

    self.allProducts = PosGlobalsService.GetAllProducts();
    self.allPlanTypes = PosGlobalsService.GetAllPlanTypes();
    self.SelectedPlanType = {};
    
    self.FieldMissingDefault = PosGlobals.FieldMissingDefault;
    self.AddedPlans = PosCartService.GetAddedPlans();
    self.currentProducts = PosCartService.GetAllCurrentProducts();
    self.currentBonusOfferedProducts = PosCartService.GetAllCurrentBonusOfferedProducts();
    self.currentPackages = PosCartService.GetAllCurrentPackages();
    
    self.AppliedPlans = PosCartService.GetAppliedPlans();
    self.TempCustomer = PosCartService.GetTempCustomer();
    self.currentSelectedCustomer = PosCartService.GetCurrentSelectedCustomer();



    $rootScope.$watch(
        function () {
            return PosCartService.GetTempCustomer();
        },
        function (customer) {
            self.TempCustomer = customer;
        }
    );
    
    $rootScope.$watch(
        function () {
            return PosCartService.GetCurrentSelectedCustomer();
        },
        function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.currentSelectedCustomer = newValue;
            }
        }
    );

    $rootScope.$watch(
        function () {
            return PosCartService.GetAppliedPlans();
        },
        function (plans) {
            self.AppliedPlans = plans;
        }
    );
    
    $rootScope.$watch(
        function () {
            return PosCartService.GetAddedPlans();
        },
        function (addedPlans) {
            self.AddedPlans = addedPlans;
        }
    );
    
    $rootScope.$watch(
        function () {
            return PosCartService.GetAllCurrentProducts();
        },
        function (newVal) {
            self.currentProducts = newVal;
        }
    );

    $rootScope.$watch(
        function () {
            return PosCartService.GetAllCurrentBonusOfferedProducts();
        },
        function (newVal) {
            self.currentBonusOfferedProducts = newVal;
        }
    );

    $rootScope.$watch(
        function () {
            return PosCartService.GetAllCurrentPackages();
        },
        function (newVal) {
            self.currentPackages = newVal;
        }
    );



    self.RemoveProduct = function (product)
    {
        PosCartService.RemoveProduct(product);
    };

    self.AddBonusOfferedProduct = function (offeredProduct) {
        PosCartService.AddBonusOfferedProduct(offeredProduct);
    };

    self.RemoveBonusOfferedProduct = function (offeredProduct) {
        PosCartService.RemoveBonusOfferedProduct(offeredProduct);
    };

    self.RemovePackage = function (pckg) {
        PosCartService.RemovePackage(pckg);
    };



    self.AddSelectedPlanTypeToCart = function ()
    {
        PosCartService.AddPlanToCart(self.SelectedPlanType);
        PosModalService.close();
    };



    self.RemovePlanFromCart = function (plan) {
        PosCartService.RemovePlanFromCart(plan);
    };


    
    self.OpenEditCustomerPlansForm = function (params)
    {
        // Anonymous, nothing to do
        if (Pos.Utils.IsAnonymousCustomer(params.searchResult.Id)) {
            console.info("Anonymous customer, nothing to do");
            return;
        }

        PosCartService.LoadAvailableToAddPlanTypes(params, function () {
            PosModalService.showModal(
                {
                    templateUrl: "templates/customers/EditPlans.html"
                },
                {
                    closeButtonText: "global.CANCEL",
                    actionButtonText: "global.ADD",
                    headerText: "customers.TITLE_EDIT_CUSTOMER_PLANS"
                }
            );
        });
    };



    self.OnPayBtnClicked = function () {

        var currentSelectedCustomer = PosCartService.GetCurrentSelectedCustomer();

        if (currentSelectedCustomer.Name !== "Unknown")
        {
            PosModalService.showModal(
                {
                    templateUrl: "templates/cart/ConfirmSale.html"
                },
                {
                    actionButtonText: "cart.BTN_CONFIRM_SALE",
                    headerText: "cart.TITLE_CONFIRM_SALE"
                }
            );
        }
        else
        {
            PosModalService.showModal(
                {
                    templateUrl: "templates/cart/NotificationNoCustomer.html"
                },
                {
                    headerText: "cart.TITLE_CHOOSE_CUSTOMER",
                    bodyText: "cart.ERROR_CART_HAS_NO_CUSTOMER"
                }
            );
        }
    };



    self.OpenConfirmSale = function () {
        PosModalService.showModal(
            {
                templateUrl: "templates/cart/ConfirmSale.html"
            },
            {
                actionButtonText: "cart.BTN_CONFIRM_SALE",
                headerText: "cart.TITLE_CONFIRM_SALE"
            }
        );
    };



    self.ReinitialiseCart = function () {
        PosCartService.ReinitialiseCart();
    };



    self.OnConfirmPaymentClicked = function ()
    {
        self.AddSaleOperation();
    };
    
    

    self.AddSaleOperation = function ()
    {
        $rootScope.actionInProgress = true;
        $rootScope.actionCompleted = false;

        if (!PosCartService.IsCurrentSaleOperationValid())
        {
            closeModal();
            console.info("CurrentSaleOperation NOT Valid");
            return;
        }

        var saleOperation = PosCartService.BuildCurrentSaleOperationObj();

        self.responseModel = PosHttpHelper.buildResponseModel();

        PosCartDataFactory.AddSaleOperation(saleOperation).then(
            function success(response) {
                self.responseModel = PosHttpHelper.buildResponseModel(response.data, saleOperation);
                PosSaleOperationsService.PopulateAllSaleOperations();
                return self.responseModel;
            },
            function error(response) {
                self.responseModel.statusCode = PosApiResponseStatusCode.CRUDoperationError;
                return self.responseModel;
            })
        .finally(function () {
            closeModal();
        });

        var closeModal = function () {
            PosModalService.close(
                self.responseModel,
                {
                    delay: 3000,
                    bodyText: "cart.SUCCES_ADD_SALES_OPERATION",
                    onCloseCallback: function () {
                        $timeout(function () {
                            self.ReinitialiseCart();
                        });
                    }
                },
				{
				    delay: 3000,
				    bodyText: "cart.ERROR_ADD_SALES_OPERATION"
				},
                forceLocalFailureMessage = true
            );

            $state.go("saleoperations/home/");
        };
    };
}

angular.module("PosManager").controller("PosCartController",
    [
        "$rootScope",
        "PosCartDataFactory",
        "PosCartService",
        "PosSaleOperationsService",
        "PosGlobalsService",
        "PosCustomersService",
        "PosPlanTypesService",
        "PosModalService",
        "PosGlobals",
        "PosUniqueFilter",
        "PosApiResponseStatusCode",
        "PosHttpHelper",
        "$state",
        "$timeout",
        PosCartController
    ]);