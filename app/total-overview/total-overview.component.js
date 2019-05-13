'use strict';

// Register `mdr` component, along with its associated controller and template
angular.module('totalOverview').component('totalOverview', {
	templateUrl: 'total-overview/total-overview.template.html',
	controller: ['$http', '$scope', 'House', 'Member',
		function TotalOverviewController($http, $scope, House, Member) {
			const self = this;
			const roleValues = Member.getRoleValues();
			self.divisions = [];
			self.members = [];

			$http.get('http://mdr.d-peters.com:2048/mdr').then(function(response) {
				let mdrData = response.data;
				for (let houseName in mdrData) {
					if (houseName === 'Special') {
						// TODO Maybe add this later
						continue;
					}
					let house = mdrData[houseName];
					let houseObject = House.create(house);
					let houseMembers = houseObject.getAllHouseMembers();
					houseMembers.map((x) => {
						x.house = houseObject.nameShort;
						x.houseColor = houseObject.color;
					});
					self.members = self.members.concat(houseMembers);
					self.divisions = self.divisions.concat(houseObject.divisions);
				}
			});

			$scope.propertyName = 'positionFormatted';
			$scope.reverse = true;
			$scope.sort_orderBy = "current";
			$scope.sortBy = function(propertyName) {
				if(propertyName === "rep" || propertyName === "post") {
					propertyName = propertyName + "Data." + $scope.sort_orderBy;
				}
				$scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
				$scope.propertyName = propertyName;
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