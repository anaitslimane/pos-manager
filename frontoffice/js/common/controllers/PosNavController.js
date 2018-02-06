function PosNavController($rootScope, PosModalService, PosLocaleService) {
    var self = this;

    $rootScope.$watch(
        function () {
            return PosLocaleService.getCurrentLocaleShort();
        },
        function (newVal) {
            self.currDisplayLocale = newVal;
        }
    );

    self.DiplayLanguageSwitchModal = function () {
        var options = {
            actionButtonText: "global.OK",
            closeButtonText: "global.CANCEL"
        };

        PosModalService.showModal({ template: "<pos-language-selector></pos-language-selector>" }, options);
    };
}

angular.module("PosManager").controller("PosNavController",
    [
        "$rootScope",
        "PosModalService",
        "PosLocaleService",
        PosNavController
    ]);