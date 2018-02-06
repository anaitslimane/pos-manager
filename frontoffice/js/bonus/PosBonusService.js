angular.module("PosManager")
	    .service("PosBonusService", function () {
	        
	        "use strict";

	        var _currentOfferableProduct = {};

	        var _buildBonus = function (bonusType, text) {
	            return {
	                ProductId: _currentOfferableProduct.Id,
	                Product: _currentOfferableProduct,
	                BonusTypeId: bonusType.Id,
	                BonusTextReason: text
	            };
	        };

	        return {
	            GetCurrentOfferableProduct: function () {
	                return _currentOfferableProduct;
	            },

	            SetCurrentOfferableProduct: function (offeredProduct) {
	                _currentOfferableProduct = offeredProduct;
	            },

	            BuildBonus: function (bonusTypeId, text) {
	                return _buildBonus(bonusTypeId, text)
	            }
	        };
	    });