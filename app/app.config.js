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
				otherwise({
					redirectTo: '/mdr',
				});
		},
	]);
