angular.module("PosManager")
    .service("PosModalService", ["$rootScope", "$uibModal", "PosApiResponseStatusCode",
        function ($rootScope, $uibModal, PosApiResponseStatusCode)
        {
            var mainModalInstance = {};
            var transientModalInstance = {};

            var modalDefaults = {
                backdrop: true,
                keyboard: false,
                modalFade: true,
                templateUrl: 'templates/common/Modal.html',
                delay: 0,
                onCloseCallback: {}
            };

            var modalOptions = {
                closeButtonText: 'Close',
                actionButtonText: 'OK',
                headerText: 'Proceed?',
                bodyText: 'Perform this action?',
                onOpenCallback : {},
                actionFunction: {},
                actionParams : {}
            };

            this.showModal = function (customModalDefaults, customModalOptions, isTransient)
            {
                if (!customModalDefaults)
                {
                    customModalDefaults = {};
                }
                //customModalDefaults.backdrop = 'static';
                customModalDefaults.backdrop = true;

                if (isTransient) {
                    transientModalInstance = this.show(customModalDefaults, customModalOptions);
                }
                else {
                    mainModalInstance = this.show(customModalDefaults, customModalOptions);

                    if (typeof customModalOptions.onOpenCallback === "function")
                    {
                        mainModalInstance.opened.then(function () {
                            customModalOptions.onOpenCallback();
                        });
                    }
                }

                if (customModalOptions.delay > 0)
                {
                    var timeoutID = setTimeout(
                        function ()
                        {
                            transientModalInstance.close();
                            clearTimeout(timeoutID);

                            if (typeof customModalOptions.onCloseCallback === "function")
                            {
                                customModalOptions.onCloseCallback();
                            }
                        },
                        customModalOptions.delay
                    );
                }
            };

            this.show = function (customModalDefaults, customModalOptions)
            {
                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};

                //Map angular-ui modal custom defaults to modal defaults defined in service
                angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

                //Map modal.html $scope custom properties to defaults defined in service
                angular.extend(tempModalOptions, modalOptions, customModalOptions);

                if (!tempModalDefaults.controller)
                {
                    tempModalDefaults.controller = function ($scope, $uibModalInstance)
                    {
                        $scope.modalOptions = tempModalOptions;

                        if (typeof tempModalOptions.actionFunction === "function")
                        {
                            $scope.modalOptions.ok = function () {
                                $uibModalInstance.close();
                                tempModalOptions.actionFunction(tempModalOptions.actionParams);
                            };
                        }
                        else
                        {
                            $scope.modalOptions.ok = function (result) {
                                $uibModalInstance.close(result);
                            };
                        }
                        $scope.modalOptions.close = function (result) {
                            $uibModalInstance.dismiss('cancel');
                        };
                    }
                }

                return $uibModal.open(tempModalDefaults);
            };

            this.close = function (responseModel, modalOptionsSuccess, modalOptionsFailure, forceLocalFailureMessage)
            {
                if (!responseModel) {
                    mainModalInstance.close();
                    return;
                }

                $rootScope.actionInProgress = false;

                var statusCode = responseModel.StatusCode || PosApiResponseStatusCode.CRUDoperationError;

                if (statusCode === PosApiResponseStatusCode.Success)
                {
                	mainModalInstance.close();

                	if (responseModel.ApiStatusPlainText != "")
                	{
                		modalOptionsSuccess.bodyText = responseModel.ApiStatusPlainText;
                	}

                    var options = {
                    	modalOptions: modalOptionsSuccess,
                        templateUrl: "templates/common/NotificationSuccess.html"
                    };

                    this.showModal({ templateUrl: options.templateUrl }, options.modalOptions, true);

                    if (typeof modalOptionsSuccess.onCloseCallback === "function") {
                        modalOptionsSuccess.onCloseCallback();
                    }
                }
                else
                {
                    if (responseModel.ApiStatusPlainText != "" && !forceLocalFailureMessage)
                	{
                		modalOptionsFailure.bodyText = responseModel.ApiStatusPlainText;
                	}

                	var options = {
                		modalOptions: modalOptionsFailure,
                		templateUrl: "templates/common/NotificationFailure.html"
                	};

                	this.showModal({ templateUrl: options.templateUrl }, options.modalOptions, true);
                }
            };
        }]);