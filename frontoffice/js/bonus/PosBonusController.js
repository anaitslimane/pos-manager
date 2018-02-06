function PosBonusController(
    $rootScope,
    PosGlobals,
    PosGlobalsService,
    PosCartService,
    PosModalService,
    PosBonusService
    )
{
    var self = this;

    self.allProducts = PosGlobalsService.GetAllProducts();
    self.allBonusTypes = PosGlobalsService.GetAllBonusTypes();
    self.offerableProducts = [];
    self.imagesRootUrl = PosGlobals.urls.api.images;
    self.ImageUrlDefault = PosGlobals.products.ImageUrlDefault;
    self.currOfferedProduct = {};

    self.currBonusReasonText = "";
    self.currSelectedBonusType = {};

    $rootScope.$watch(
        function () {
            return PosCartService.GetOfferableProducts();
        },
        function (newVal) {
            self.offerableProducts = newVal;
        }
    );

    $rootScope.$watch(
        function () {
            return PosBonusService.GetCurrentOfferableProduct();
        },
        function (newVal) {
            self.currOfferedProduct = newVal;
        }
    );

    self.FormatProductSearchResult = function (obj) {
        var str = obj.searchResult.Name + ", " + obj.searchResult.Price;
        return str;
    };

    self.OpenAddBonusType = function (offeredProduct) {

        // reset current
        PosBonusService.SetCurrentOfferableProduct(offeredProduct);

        PosModalService.showModal(
            {
                templateUrl: "templates/bonus/ConfirmBonus.html"
            },
            {
                closeButtonText: "global.CANCEL",
                actionButtonText: "global.VALIDATE",
                headerText: "bonus.TITLE_BONUS_TYPE"
            }
        );
    };

    self.AddBonusOfferedToCart = function ()
    {
        if (typeof (self.currOfferedProduct) === "undefined" ||
            typeof (self.currOfferedProduct.Id) === "undefined" ||
            typeof (self.currSelectedBonusType) === "undefined" ||
            typeof (self.currSelectedBonusType.Id) === "undefined")
        {
            return;
        }

        var bonus = PosBonusService.BuildBonus(self.currSelectedBonusType, self.currBonusReasonText);

        PosCartService.AddBonusOfferedProduct(bonus);
    };
}

angular.module("PosManager").controller("PosBonusController",
    [
        "$rootScope",
        "PosGlobals",
        "PosGlobalsService",
        "PosCartService",
        "PosModalService",
        "PosBonusService",
        PosBonusController
    ]);