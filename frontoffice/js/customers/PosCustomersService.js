angular.module("PosManager")
	    .service("PosCustomersService", ["$http", "PosCustomersDataFactory", function ($http, PosCustomersDataFactory) {
	        'use strict';

	        var _currentCustomer = {};
	        var _currentSelectedCustomer = {};	        
	        var _lastLoadedCustomer = {};

	        return {
	            GetCurrentCustomer: function ()
	            {
	                return _currentCustomer;
	            },

	            SetCurrentCustomer: function (customer)
	            {
	            	_currentCustomer = customer;
	            },

	            ResetCurrentCustomer: function ()
	            {
	                _currentCustomer = {};
	            },

	            SetLastLoadedCustomer: function (customer)
	            {
	            	_lastLoadedCustomer = angular.copy(customer);
	            },

	            GetLastLoadedCustomer: function ()
	            {
	            	return _lastLoadedCustomer;
	            }
	        };
	    }]);