function PosPackagesController(
    $rootScope,
    PosGlobals,
    PosGlobalsService,
    PosCartService
    )
{
    var self = this;

    self.allPackages = PosGlobalsService.GetAllPackages();
    self.imagesRootUrl = PosGlobals.urls.api.images;
    self.ImageUrlDefault = PosGlobals.packages.ImageUrlDefault;

    self.FormatPackageSearchResult = function (obj) {
        var str = obj.searchResult.Name + ", " + obj.searchResult.Price;
        return str;
    };

    self.AddToCart = function (pckg)
    {
        if (pckg) {
            PosCartService.AddPackage(pckg);
        }
    };
}

angular.module("PosManager").controller("PosPackagesController",
    [
        "$rootScope",
        "PosGlobals",
        "PosGlobalsService",
        "PosCartService",
        PosPackagesController
    ]);