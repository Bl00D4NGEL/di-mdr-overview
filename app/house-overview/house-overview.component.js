'use strict';

angular.module('houseOverview').component('houseOverview', {
	templateUrl: 'house-overview/house-overview.template.html',
	controller: ['$http', '$routeParams', '$scope', 'House', 'Member',
		function HouseOverviewController($http, $routeParams, $scope, House, Member) {
			const self = this;
			const roleValues = Member.getRoleValues();
			$http.get('http://mdr.d-peters.com:2048/house/' + $routeParams.houseId).then(function(response) {
				const data = response.data;
				let houseObject = House.create(data);
				self.house = houseObject;
				self.members = self.house.getAllHouseMembers();
			});

			$scope.propertyName = 'positionFormatted';
			$scope.reverse = true;
			$scope.sort_orderBy = "current";
			$scope.sortBy = function(propertyName) {
				if(propertyName === "rep" || propertyName === "post") {
					propertyName = propertyName + "Data." + $scope.sort_orderBy;
				}
				$scope.propertyName = propertyName;
				$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
			};
			$scope.rankComparator = function(v1, v2) {
				// If we don't get strings, just compare by index
				if (v1.type !== 'string' || v2.type !== 'string') {
					return (v1.value < v2.value) ? -1 : 1;
				}
				else if (roleValues[v1.value] !== undefined && roleValues[v2.value] !== undefined) {
					return (roleValues[v1.value] < roleValues[v2.value]) ? -1 : 1;
				}
				else {
					// Compare strings alphabetically, taking locale into account
					return v1.value.localeCompare(v2.value);
				}
			};
		},
	],
});
