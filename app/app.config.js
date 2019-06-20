'use strict';

angular.
	module('diMdrOverview').
	config(['$routeProvider',
		function config($routeProvider) {
			$routeProvider.
				when('/mdr', {
					template: '<mdr></mdr>',
				}).
				when('/total', {
					template: '<total-overview></total-overview>',
				}).
				when('/division/:divisionId', {
					template: '<division-overview></division-overview>',
				}).
				when('/house/:houseId', {
					template: '<house-overview></house-overview>'
				}).
				when('/tools', {
					template: '<officer-tools></officer-tools>'
				}).
				otherwise({
					redirectTo: '/mdr',
				});
		},
	]);

angular.
	module('diMdrOverview').
	config(['$compileProvider', '__env', 
		function ($compileProvider, __env) {
			$compileProvider.debugInfoEnabled(__env.enableDebug);
		}
	]);
