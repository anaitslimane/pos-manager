function PosSaleOperationsController(
    $rootScope,
    PosGlobals,
    PosHttpHelper,
    PosSaleOperationsDataFactory,
    PosModalService,
    PosApiResponseStatusCode,
    PosSaleOperationsService)
{
    var self = this;

    self.allSaleOperations = PosSaleOperationsService.GetAllSaleOperations();

    // init saleOperations if none
    if (Pos.Utils.GetLength(self.allSaleOperations) == 0) {
        PosSaleOperationsService.PopulateAllSaleOperations();
    }

    $rootScope.$watch(
        function () {
            return PosSaleOperationsService.GetAllSaleOperations();
        },
        function (allSaleOperations) {
            self.allSaleOperations = allSaleOperations;
        }
    );

    $rootScope.$watch(
        function () {
            return PosSaleOperationsService.GetCurrentSaleOperation();
        },
        function (currUpdateSaleOperation) {
            self.CurrIsCanceled = currUpdateSaleOperation.UpdateObj.IsCanceled;
        }
    );

    $rootScope.$watch(
        function () {
            return self.CurrIsCanceled;
        },
        function (isCanceled) {
            PosSaleOperationsService.SetCurrentSaleOperationCanceledState(isCanceled);
        }
    );

    self.PosSaleOperationsService = PosSaleOperationsService;
    self.responseModel = {};
    self.currentSaleOperation = PosSaleOperationsService.GetCurrentSaleOperation();
    self.FieldMissingDefault = PosGlobals.FieldMissingDefault;



    self.ShowModal = function (options) {
        PosModalService.showModal({ templateUrl: options.templateUrl }, options.modalOptions);
    };



    self.OpenEditSaleOperationForm = function (saleOperation)
    {
        PosSaleOperationsService.SetCurrentSaleOperation(saleOperation);
        self.ShowModal(self.modals.saleOperationEdit);
    }



    self.CancelSaleOperation = function () {
        var currSaleOperation = PosSaleOperationsService.GetCurrentSaleOperation();

        if(!currSaleOperation.UpdateObj.IsCanceled){
            return;
        }

        $rootScope.actionInProgress = true;
        $rootScope.actionCompleted = false;        

        self.responseModel = PosHttpHelper.buildResponseModel();

        PosSaleOperationsDataFactory.CancelSaleOperation(currSaleOperation.UpdateObj).then(
            function success(response) {
                self.responseModel = PosHttpHelper.buildResponseModel(response.data);
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
                    bodyText: "saleoperations.SUCCES_UPDATE_SALEOPERATION",
                    onCloseCallback: function () {
                        PosSaleOperationsService.PopulateAllSaleOperations();
                    }
                },
				{
					delay: 3000,
					bodyText: "saleoperations.ERROR_UPDATE_SALEOPERATION"
				}
            );
        });
    };



    self.modals = {
        "saleOperationEdit": {
    		modalOptions: {
    		    closeButtonText: "global.CANCEL",
    		    actionButtonText: "global.SAVE",
                headerText: "saleoperations.TITLE_SALEOPERATION_EDIT"
    		},
    		templateUrl: "/templates/saleoperations/Edit.html"
		}
    };
}

angular.module("PosManager").controller("PosSaleOperationsController",
                [
                    "$rootScope",
                    "PosGlobals",
                    "PosHttpHelper",
                    "PosSaleOperationsDataFactory",
                    "PosModalService",
                    "PosApiResponseStatusCode",
                    "PosSaleOperationsService",
                    PosSaleOperationsController
                ]);