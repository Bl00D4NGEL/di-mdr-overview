'use strict';

// Register `mdr` component, along with its associated controller and template
angular.module('mdr').component('mdr', {
	templateUrl: 'mdr/mdr.template.html',
	controller: ['$http', '$scope', 'House', '__env',
		function MdrController($http, $scope, House, __env) {
			const self = this;
			self.divisions = [];

			$http.get(__env.apiUrl + '/mdr', {cache: true}).then(function(response) {
				const mdrData = response.data;
				for (const houseName in mdrData) {
					if (houseName === 'Special') {
						// TODO Maybe add this later
						continue;
					}
					const house = mdrData[houseName];
					let houseObject = House.create(house);
					console.log(houseObject);
					self.divisions = self.divisions.concat(houseObject.divisions);
				}
			});

			$scope.propertyName = 'house';
			$scope.reverse = true;
			$scope.sortBy = function(propertyName) {
				$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
				$scope.propertyName = propertyName;
			};
		},
	],
});