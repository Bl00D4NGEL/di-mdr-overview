'use strict';

angular.
	module('diMdrOverview').
	config(['$routeProvider',
		function config($routeProvider) {
			$routeProvider.
				when('/mdr', {
					template: '<mdr></mdr>',
				}).
				when('/division/:divisionId', {
					template: '<division-overview></division-overview>',
				}).
				when('/house/:houseId', {
					template: '<house-overview></house-overview>'
				}).
				otherwise({
					redirectTo: '/mdr',
				});
		},
	]);
