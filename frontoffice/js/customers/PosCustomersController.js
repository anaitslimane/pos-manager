function PosCustomersController(
    $rootScope,
    PosGlobals,
    PosHttpHelper,
    PosCustomersDataFactory,
    PosModalService,
    PosApiResponseStatusCode,
    PosCustomersService,
    PosCartService,
    PosGlobalsService,
    $timeout,
    $filter) {
    var self = this;

    self.PosCustomersService = PosCustomersService;
    self.responseModel = {};
    self.currentCustomer = PosCustomersService.GetCurrentCustomer();
    self.UpdateErrors = {};
    self.FieldMissingDefault = PosGlobals.FieldMissingDefault;
    self.searchUrl = PosGlobals.urls.api.searchCustomers;
    self.SelectedCountryCode = PosGlobals.SelectedCountryCode;
    self.currentCartSelectedCustomer = PosCartService.GetCurrentSelectedCustomer();



    $rootScope.$watch(
        function () {
            return PosCartService.GetCurrentSelectedCustomer();
        },
        function (newValue, oldValue) {
            if (newValue !== oldValue) {
                self.currentCartSelectedCustomer = newValue;
            }
        }
    );



    self.ShowModal = function (options) {
    	PosModalService.showModal({ templateUrl: options.templateUrl }, options.modalOptions, options.isTransient);
    };



    self.OpenAddCustomerForm = function () {
        PosCustomersService.ResetCurrentCustomer();
        self.ShowModal(self.modals.add);
    }



    self.IsAnonymous = function (cid) {
        return Pos.Utils.IsAnonymousCustomer(cid);
    };



    self.LoadCustomerDetails = function (params, callback)
    {
        PosCustomersDataFactory.GetCustomerById(params.searchResult.Id).then(
            function success(response)
            {
            	if (response.data.ApiResponseStatusCode === PosApiResponseStatusCode.Success)
            	{
            		callback(response.data.ApiResult);
            	}
            	else if (response.data.ApiResponseStatusCode === PosApiResponseStatusCode.CRUDoperationError)
            	{
            		self.ShowModal({
            			modalOptions: {
            				headerText: "customers.TITLE_CUSTOMER_DETAILS",
            				delay: 3000,
            				bodyText: "customers.ERROR_GET_CUSTOMER"
            			},
            			templateUrl: "templates/common/NotificationFailure.html",
            			isTransient: true
            		});
            	}
            },
            function error(response)
            {
            	console.log("GetCustomerById Error");
            });
    };



    self.LoadCustomerPreviewData = function (customer, callback) {
        PosCustomersDataFactory.GetCustomerGlobalPreviewData(customer.Id).then(
            function success(response) {
                if (response.data.ApiResponseStatusCode === PosApiResponseStatusCode.Success) {
                    callback(response.data.ApiResult);
                }
                else if (response.data.ApiResponseStatusCode === PosApiResponseStatusCode.CRUDoperationError) {
                    self.ShowModal({
                        modalOptions: {
                            headerText: "customers.TITLE_CUSTOMER_DETAILS",
                            delay: 3000,
                            bodyText: "customers.ERROR_GET_CUSTOMER"
                        },
                        templateUrl: "templates/common/NotificationFailure.html",
                        isTransient: true
                    });
                }
            },
            function error(response) {
                console.error("GetCustomerPreviewDataById Error");
            });
    };



    self.GetCountryNameFromCode = function (countryCode)
    {
        var countries = PosGlobalsService.GetCountries();
        var countryName = countryCode;

        if (countries && countries.length > 0)
        {
            var i = countries.length;
            while (i--) {
                if (countries[i].CountryCode === countryCode) {
                    countryName = countries[i].Name;
                    break;
                }
            }
        }

        return countryName;
    };



    // params = {'searchResult': searchResult, 'event': $event}
    self.OpenCustomerDetailsPreview = function (customer)
    {
        // Anonymous, nothing to do
        if (Pos.Utils.IsAnonymousCustomer(customer.Id))
        {
            console.info("Anonymous customer, nothing to do");
            return;
        }

        self.LoadCustomerPreviewData(customer, function (customer)
        {
            PosCustomersService.SetCurrentCustomer(customer);
    		self.ShowModal(self.modals.customerDetailsPreview);
    	});
    };



    // params = {'searchResult': searchResult, 'event': $event}
    self.OpenUpdateCustomerForm = function (params)
    {
        // Anonymous, nothing to do
        if (Pos.Utils.IsAnonymousCustomer(params.searchResult.Id)) {
            console.info("Anonymous customer, nothing to do");
            return;
        }

        self.LoadCustomerDetails(params, function (customer)
        {
            PosCustomersService.SetCurrentCustomer(customer);
    		PosCustomersService.SetLastLoadedCustomer(customer);
    		self.ShowModal(self.modals.edit);
    	});
    };
    


    // params = {'searchResult': searchResult, 'event': $event}
    self.OpenEditCustomerPlansForm = function (params)
    {
        console.log("OpenEditCustomerPlansForm -> params: ", params);

        // Anonymous, nothing to do
        if (Pos.Utils.IsAnonymousCustomer(params.searchResult.Id)) {
            console.info("Anonymous customer, nothing to do");
            return;
        }

        PosCartService.LoadAvailableToAddPlanTypes(params, function () {
            self.ShowModal(self.modals.editPlans);
        });
    };



    self.SetAnonymousCustomer = function () {
        console.info("Setting Anonymous customer!");
        PosCartService.SetAnonymousAsCurrentSelectedCustomer();
    };



    // params = {'searchResult': searchResult, 'event': $event}
    self.SetCurrentSelectedCustomer = function (params) {
        PosCartService.SetCurrentSelectedCustomer(params, function () {
            
        });
    };

    self.FormatCustomerSearchResult = function (obj) {
        return obj.searchResult.Name + ", " + obj.searchResult.FamilyName + ", " + obj.searchResult.Street;
    };



    self.AddCustomer = function () {
        $rootScope.actionInProgress = true;
        $rootScope.actionCompleted = false;

        self.responseModel = PosHttpHelper.buildResponseModel();

        PosHttpHelper.cleanupEntityBeforeRequest(self.currentCustomer);

        PosCustomersDataFactory.AddCustomer(self.currentCustomer).then(
            function success(response) {
                self.responseModel = PosHttpHelper.buildResponseModel(response.data, self.currentCustomer);

                // update the customers search list
                if (self.responseModel.StatusCode === PosApiResponseStatusCode.Success)
                {
                    // should be updated, since it empties the infructuous list
                    // for everywhere search component directive is used
                    $rootScope.$broadcast("reset-search-list-infructuous");
                }

                return self.responseModel;
            },
            function error(response) {
                self.responseModel.statusCode = PosApiResponseStatusCode.CRUDoperationError;
                return self.responseModel;
            })
        .finally(function () {
            PosModalService.close(
                self.responseModel,
                {
                    delay: 3000,
                    bodyText: "customers.SUCCES_ADD_CUSTOMER"
                },
				{
				    delay: 3000,
				    bodyText: "customers.ERROR_ADD_CUSTOMER"
				}
            );
        });
    };



    self.UpdateCustomer = function ()
    {
        var lastCustomer = PosCustomersService.GetLastLoadedCustomer();

        if (self.currentCustomer.Name == lastCustomer.Name
            && self.currentCustomer.FamilyName == lastCustomer.FamilyName
            && self.currentCustomer.Street == lastCustomer.Street
            && self.currentCustomer.ZipCode == lastCustomer.ZipCode
            && self.currentCustomer.City == lastCustomer.City
            && self.currentCustomer.CountryCode == lastCustomer.CountryCode
            && self.currentCustomer.PhoneNumber == lastCustomer.PhoneNumber
            && self.currentCustomer.Email == lastCustomer.Email
            )
    	{
    		self.UpdateErrors.CustomerUnchanged = true;
    		return;
    	}

        $rootScope.actionInProgress = true;
        $rootScope.actionCompleted = false;

        self.responseModel = PosHttpHelper.buildResponseModel();

        PosHttpHelper.cleanupEntityBeforeRequest(self.currentCustomer);

        PosCustomersDataFactory.UpdateCustomer(self.currentCustomer).then(
            function success(response) {
                self.responseModel = PosHttpHelper.buildResponseModel(response.data, self.currentCustomer);
                return self.responseModel;
            },
            function error(response) {
                self.responseModel.statusCode = PosApiResponseStatusCode.CRUDoperationError;
                return self.responseModel;
            })
        .finally(function () {
            PosModalService.close(
                self.responseModel,
                {
                    delay: 3000,
                    bodyText: "customers.SUCCES_SAVE_CUSTOMER"
                },
				{
				    delay: 3000,
				    bodyText: "customers.ERROR_SAVE_CUSTOMER"
				}
            );
        });
    };



    self.modals = {
        "add": {
            modalOptions: {
                closeButtonText: "global.CANCEL",
                actionButtonText: "customers.BTN_CONFIRM_ADD_NEW",
                headerText: "customers.TITLE_ADD_NEW"
            },
            templateUrl: "templates/customers/Add.html"
        },

        "edit": {
            modalOptions: {
                closeButtonText: "global.CANCEL",
                actionButtonText: "global.SAVE",
                headerText: "customers.TITLE_EDIT"
            },
            templateUrl: "templates/customers/Edit.html"
        },
        "customerDetailsPreview": {
        	modalOptions: {
        		closeButtonText: "global.OK",
        		headerText: "customers.TITLE_CUSTOMER_DETAILS"
        	},
        	templateUrl: "templates/customers/PreviewCustomer.html"
        },
        "editPlans": {
            modalOptions: {
                closeButtonText: "global.CANCEL",
                actionButtonText: "global.ADD",
                headerText: "customers.TITLE_EDIT_CUSTOMER_PLANS"
            },
            templateUrl: "templates/customers/EditPlans.html"
        }
    };
}

angular.module("PosManager").controller("PosCustomersController",
                [
                    "$rootScope",
                    "PosGlobals",
                    "PosHttpHelper",
                    "PosCustomersDataFactory",
                    "PosModalService",
                    "PosApiResponseStatusCode",
                    "PosCustomersService",
                    "PosCartService",
                    "PosGlobalsService",
                    "$timeout",
                    "$filter",
                    PosCustomersController
                ]);