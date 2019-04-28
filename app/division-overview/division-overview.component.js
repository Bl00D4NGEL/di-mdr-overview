'use strict';

// Register `divisionOverview` component, along with its associated controller and template
angular.module('divisionOverview').component('divisionOverview', {
	templateUrl: 'division-overview/division-overview.template.html',
	controller: ['$http', '$routeParams', '$scope',
		function DivisionOverviewController($http, $routeParams, $scope) {
			const self = this;
			const roleMap = GetRoleMap();
			const roleValues = GetRoleValues(roleMap);

			$http.get('http://localhost:2048/division/' + $routeParams.divisionId).then(function(response) {
				const data = response.data;
				self.house = data.House;
				self.houseLower = data.House.toLowerCase();
				self.game = data.Game.name;
				self.gameImageName = GetGameImageNameForGame(self.game);
				self.members = [];
				let higherMembers = GetHigherMembers(data);
				const teams = data.Teams;
				for (const teamName in teams) {
					const team = teams[teamName];
					const teamHigherups = GetHigherMembers(team);
					higherMembers = higherMembers.concat(teamHigherups);
					const rosters = team.Rosters;
					for (const rosterName in rosters) {
						const roster = team.Rosters[rosterName];
						roster.teamName = teamName;
						roster.rosterName = rosterName;
						let rosterMembers = GetRosterMembersFromRoster(roster);
						rosterMembers = rosterMembers.concat(higherMembers);
						higherMembers = [];
						const formattedRosterName = GetFormattedRosterNameFromRoster(roster);
						for (let i=0; i<rosterMembers.length; i++) {
							const member = rosterMembers[i];
							let rosterName = formattedRosterName;
							if (member.position === 'TL') {
								rosterName = teamName;
							}
							if (member.position === 'DV' || member.position === 'DC') {
								rosterName = '';
							}
							if (roleMap[member.position]) {
								member.position = roleMap[member.position].name;
							}
							self.members.push({
								role: member.position,
								name: member.member_name,
								rep: member.member_rep,
								posts: member.member_posts,
								id: member.member_id,
								country: member.country,
								roster: rosterName,
							});
						}
					}
				}
			});

			$scope.propertyName = 'role';
			$scope.reverse = true;
			$scope.sortBy = function(propertyName) {
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

function GetHigherMembers(data) {
	const higherMembers = [];
	if (data.Commander) {
		const DC = data.Commander[0];
		higherMembers.push(DC);
	}
	if (data.Vice) {
		const Vice = data.Vice[0];
		higherMembers.push(Vice);
	}
	if (data['2IC']) {
		const TwoIC = data['2IC'][0];
		higherMembers.push(TwoIC);
	}

	if (data.TL) {
		const TL = data.TL[0];
		higherMembers.push(TL);
	}
	return higherMembers;
}

function GetRosterMembersFromRoster(roster) {
	const members = [];

	if (roster.RL) {
		const RL = roster.RL[0];
		// Add the RL to the rostermembers for the following for-loop
		roster.Members.push(RL);
	}
	if (roster.Subs) {
		roster.Members = roster.Members.concat(roster.Subs);
	}
	if (roster.Members) {
		for (let i = 0; i < roster.Members.length; i++) {
			const member = roster.Members[i];
			members.push(member);
		}
	}

	return members;
}

function GetFormattedRosterNameFromRoster(roster) {
	const teamName = roster.teamName.replace('Team ', '');
	const rosterName = roster.rosterName.replace('Roster ', '');
	return teamName + rosterName;
}

function GetRoleMap() {
	const roleMap = {
		'SUB': {
			name: 'Sub Player',
			value: 0,
		},
		'TM': {
			name: 'Member',
			value: 1,
		},
		'RL': {
			name: 'Roster Leader',
			value: 2,
		},
		'2IC': {
			name: '2IC',
			value: 3,
		},
		'TL': {
			name: 'Team Leader',
			value: 4,
		},
		'DV': {
			name: 'Vice',
			value: 5,
		},
		'DC': {
			name: 'Commander',
			value: 6,
		},
	};
	return roleMap;
}

function GetRoleValues(roleMap) {
	if (roleMap === undefined) {
		roleMap = GetRoleMap();
	}
	const roleValues = {};
	for (const rank in roleMap) {
		roleValues[roleMap[rank].name] = roleMap[rank].value;
	}
	return roleValues;
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