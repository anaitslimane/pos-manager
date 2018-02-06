var BaseApiUrl = "http://localhost:2403/pos-api";
var AuthTokenUrl = "http://localhost:2403/token";

angular.module("PosManager")
    .constant("PosGlobals",
    {
    	"locales": {
    		"fr_DZ": "Français Algérie",
		    "fr_FR": "Français",
		    "en_US": "English"
	    },
    	"preferredLocale": "fr_DZ",
	    "paths": {
		    "countries": {
		        "fr": "resources/countries/countries-fr.json",
		        "en": "resources/countries/countries-en.json"
		    },
		    "products": {
		        "fr": "resources/products/products-fr.json",
		        "en": "resources/products/products-en.json"
		    }
	    },
	    "urls": {
	        "client": {
	            "base": "http://pos-manager-frontoffice:85",
                "login": "/login"
	        },
		    "api": {
			    "base": BaseApiUrl,
			    "flag": "pos-api",
			    "getAllCountries": BaseApiUrl + "/global/getallcountries",
			    "searchCustomers": BaseApiUrl + "/customers/search",
			    "getAllProducts": BaseApiUrl + "/products/getall",
			    "getAllOfferableProducts": BaseApiUrl + "/products/getalloffereable",
			    "getAllPackages": BaseApiUrl + "/packages/getallactive",
			    "getAllBonusTypes": BaseApiUrl + "/bonustypes/getallbonustypes",
			    "getAuthToken": AuthTokenUrl,
			    "images": BaseApiUrl + "/images",
			    "uploads": {
			        "addImage": BaseApiUrl + "/uploads/addimage"
			    }
		    },
	    },
	    "packages": {
	        "ImageUrlDefault": "PackageImageUrlDefault.png"
	    },
	    "products": {
	        "ImageUrlDefault": "ProductImageUrlDefault.png"
	    },
	    "FieldMissingDefault": "-",
	    "AnonymousCustomerId": "-1000000", // FR-DZ
        //"AnonymousCustomerId": "-1000001", FR
        //"AnonymousCustomerId": "-1000002", EN
        "SelectedCountryCode" : "FR",
	    "States": [
            "login",
            "home",
            "customers/home/",
            "customers/add/",
            "customers/edit/",
            "products/home/",
            "packages/home/",
            "saleoperations/home/"
	    ]
    });