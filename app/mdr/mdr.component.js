'use strict';

// Register `mdr` component, along with its associated controller and template
angular.module('mdr').component('mdr', {
	templateUrl: 'mdr/mdr.template.html',
	controller: ['$http', '$scope', 'House',
		function MdrController($http, $scope, House) {
			const self = this;
			self.divisions = [];

			$http.get('http://mdr.d-peters.com:2048/mdr').then(function(response) {
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