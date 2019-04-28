'use strict';

// Register `mdr` component, along with its associated controller and template
angular.module('mdr').component('mdr', {
	templateUrl: 'mdr/mdr.template.html',
	controller: ['$http', '$scope',
		function MdrController($http, $scope) {
			const self = this;
			self.divisions = [];

			$http.get('http://localhost:2048/mdr').then(function(response) {
				const mdrData = response.data;
				for (const houseName in mdrData) {
					if (houseName === 'Special') {
						// TODO Maybe add this later
						continue;
					}
					const house = mdrData[houseName];

					const houseDivisions = GetDivisionsFromHouse(house);
					self.divisions = self.divisions.concat(houseDivisions);
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

function GetDivisionsFromHouse(house) {
	const divisions = [];
	for (const divisionName in house.Divisions) {
		const division = house.Divisions[divisionName];
		if (IsZeroMemberDivision(division)) {
			continue;
		}
		division.id = GetDivisionIdForName(divisionName);
		division.divisionName = divisionName;
		division.houseName = GetShortHouseName(house.name);
		division.houseLower = division.houseName.toLowerCase();
		division.imageName = GetShortDivisionName(division.divisionName).toLowerCase();
		division.gameImageName = GetGameImageNameForGame(division.Game.name);
		division.isSeed = IsDivisionSeedDivision(division);
		division.isNotCompliant = IsDivisionNotCompliant(division);
		if (division.isNotCompliant) {
			const ncDetails = GetNCDetailsForDivision(division);
			division.ncDetails = ncDetails;
		}

		division.isSuper = IsDivisionSuperDivision(division);
		if (division.isSuper) {
			const sdDetails = GetSDDetailsForDivision(division);
			division.sdDetails = sdDetails;
		}
		divisions.push(division);
	}
	return divisions;
}

function GetDivisionIdForName(name) {
	return name.replace('DI-', '').toLowerCase();
}

function IsZeroMemberDivision(division) {
	return (division.Count === 0);
}

function GetShortHouseName(name) {
	return name.replace('House - ', '');
}

function GetShortDivisionName(name) {
	return name.replace(/di-/i, '');
}

function GetGameImageNameForGame(gameName) {
	const gameMapper = {
		'League of Legends': 'lol',
		'Fortnite': 'fortnite',
		'Rust': 'rust',
		'Apex Legends': 'apex',
		'Rocket League': 'rocket-league',
		'Counter Strike': 'csgo',
		'DOTA 2': 'dota2',
		'Overwatch': 'overwatch',
		'Rainbow Six Siege': 'r6',
	};
	return gameMapper[gameName];
}

function IsDivisionSeedDivision(division) {
	return (division.is_seed);
}

function IsDivisionNotCompliant(division) {
	return (!division.Compliant);
}

function IsDivisionSuperDivision(division) {
	return (division.Super);
}

function GetNCDetailsForDivision(division) {
	const ncDetails = {};
	const notCompliantSinceInDays = GetTimeDifferenceInDays(division.NCSince);
	ncDetails.ncSinceInDays = notCompliantSinceInDays;
	return ncDetails;
}

function GetTimeDifferenceInDays(milliseconds) {
	const date = new Date();
	date.setUTCHours(0);
	date.setUTCMinutes(0);
	let currentMilliseconds = date.valueOf();
	currentMilliseconds /= 1000;
	const secondsInDay = 60 * 60 * 24;
	const days = (currentMilliseconds - milliseconds) / secondsInDay;
	return parseInt(Math.round(days));
}

function GetSDDetailsForDivision(division) {
	const sdDetails = {};
	const superDivisionSinceInDays = GetTimeDifferenceInDays(division.SDSince);
	sdDetails.sdSinceInDays = superDivisionSinceInDays;
	return sdDetails;
}
