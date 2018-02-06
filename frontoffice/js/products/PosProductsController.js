function PosProductsController(
    $rootScope,
    PosGlobals,
    PosGlobalsService,
    PosCartService
    )
{
    var self = this;

    self.allProducts = PosGlobalsService.GetAllProducts();
    self.offerableProducts = [];
    self.imagesRootUrl = PosGlobals.urls.api.images;
    self.ImageUrlDefault = PosGlobals.products.ImageUrlDefault;

    $rootScope.$watch(
        function () {
            return PosCartService.GetOfferableProducts();
        },
        function (newVal) {
            self.offerableProducts = newVal;
        }
    );

    self.FormatProductSearchResult = function (obj) {
        var str = obj.searchResult.Name + ", " + obj.searchResult.Price;
        return str;
    };

    self.AddToCart = function (product)
    {
        PosCartService.AddProduct(product);
    };

    self.OpenAddBonusReason = function () {
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

    self.AddBonusOfferedToCart = function (offeredProduct)
    {
        PosCartService.AddBonusOfferedProduct(offeredProduct);
    };
}

angular.module("PosManager").controller("PosProductsController",
    [
        "$rootScope",
        "PosGlobals",
        "PosGlobalsService",
        "PosCartService",
        PosProductsController
    ]);