'use strict';

// Register `divisionOverview` component, along with its associated controller and template
angular.module('divisionOverview').component('divisionOverview', {
	templateUrl: 'division-overview/division-overview.template.html',
	controller: ['$http', '$routeParams', '$scope', 'Division', 'Member',
		function DivisionOverviewController($http, $routeParams, $scope, Division, Member) {
			const self = this;
			const roleValues = Member.getRoleValues();
			$http.get('http://mdr.d-peters.com:2048/division/' + $routeParams.divisionId).then(function(response) {
				let data = response.data;
				let divisionObject = Division.create(data);
				divisionObject.house = data.House;
				self.division = divisionObject;
				self.members = self.division.getAllDivisionMembers();
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
	bindings: {
		"search.name": '&',
	}
});
