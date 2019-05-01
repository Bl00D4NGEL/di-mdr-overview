'use strict';

let app = angular.module('diMdrOverview')

app.factory('House', ['Member', 'Division', function(Member, Division) {
    return {
        create: function(data) {
            function House(houseData) {
                if(houseData === undefined) {
                    return;
                }
                this.name = houseData.name;
                this.nameShort = this.name.replace("House - ", "");
                this.setHouseGeneral(houseData["House General"]);
                this.setFirstCommander(houseData["First Commander"]);
                this.color = houseData.color;
                this.memberData = Member.getMemberDataFromData(houseData);
                this.posts = houseData.posts;
                this.isCompliant = houseData.Compliant;
                if(houseData.Divisions !== undefined) {
                    this.divisions = [];
                    for (let divisionName in houseData.Divisions) {
                        let division = houseData.Divisions[divisionName];
                        division.house = this;
                        this.addDivision(division);
                    }
                }
            }

            House.prototype.setFirstCommander = function(firstCommanderData) {
                if(Array.isArray(firstCommanderData)) {
                    firstCommanderData = firstCommanderData[0];
                } 
                this.firstCommander = Member.create(firstCommanderData);
            }

            House.prototype.setHouseGeneral = function(houseGeneralData) {
                if(Array.isArray(houseGeneralData)) {
                    houseGeneralData = houseGeneralData[0];
                } 
                this.houseGeneral = Member.create(houseGeneralData);
            }

            House.prototype.addDivision = function(divisionData) {
                let div = Division.create(divisionData);
                div.house = this;
                this.divisions.push(div);
            }

            return new House(data);
        }
    }   
}]);

app.factory('Division', ['Member', 'Team', function(Member, Team) {
    return {
        create: function(data) {
            function Division(divisionData) {
                if(divisionData === undefined) {
                    return;
                }
                this.color = divisionData.color;
                this.name = divisionData.name;
                this.nameShort = this.name.replace("DI-", "");
                this.teams = [];
                if(data.Teams !== undefined) {
                    for (let teamName in data.Teams) {
                        let team = data.Teams[teamName];
                        team.division = this.name;
                        this.addTeam(team);
                    }
                }
                this.setVice(divisionData.Vice);
                this.setCommander(divisionData.Commander);
                this.isRepDrainEnabled = (divisionData.rep_drain_enabled === 1 ? true : false);
                this.divisionColor = divisionData.color;
                if(divisionData.Game !== undefined) {
                    this.game = divisionData.Game.name;
                }
                this.isSuperDivision = divisionData.super;
                if(this.isSuperDivision) {
                    this.sdData = getSdDataFromData(divisionData);
                }
                this.memberData = Member.getMemberDataFromData(divisionData);
                this.isSeedDivision = (divisionData.is_seed === 1 ? true : false);
                this.rep = divisionData.rep;
                this.posts = divisionData.posts;
                this.isCommunityDivision = !(this.name !== undefined && this.name.match(/^DI-C/) === null);
                this.isCompliant = divisionData.Compliant;
                if(this.isCompliant === false) {
                    this.ncData = getNcDataFromData(divisionData);
                }
            }

            Division.prototype.setVice = function(viceData) {
                if(Array.isArray(viceData)) {
                    viceData = viceData[0];
                }
                this.vice = Member.create(viceData);
            }

            Division.prototype.setCommander = function(commanderData) {
                if(Array.isArray(commanderData)) {
                    commanderData = commanderData[0];
                }
                this.commander = Member.create(commanderData);
            }

            Division.prototype.getGameImageName = function() {
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
                return gameMapper[this.game];
            }

            Division.prototype.addTeam = function(teamData) {
                let team = Team.create(teamData);
                team.division = this;
                this.teams.push(team);
            }

            Division.prototype.getAllDivisionMembers = function() {
                let members = [];
                if(this.commander !== undefined) {
                    members.push(this.commander);
                }
                if(this.vice !== undefined) {
                    members.push(this.vice);
                }
                if(this.teams !== undefined) {
                    for (let i = 0; i < this.teams.length; i++) {
                        let team = this.teams[i];
                        let teamMembers = team.getAllTeamMembers();
                        members = members.concat(teamMembers);                        
                    }
                }
                return members;
            }

            return new Division(data);
        }
    }
}]);

app.factory('Team', ['Member', 'Roster', function(Member, Roster){
    return {
        create: function(data){
            function Team(teamData) {
                if(teamData.Rosters !== undefined) {
                    this.rosters = [];
                    for (let rosterName in teamData.Rosters) {
                        let roster = teamData.Rosters[rosterName];
                        this.addRoster(roster);
                    }
                }
                this.set2IC(teamData["2IC"]);
                this.setTeamLeader(teamData.TL);
                this.name = teamData.name;
                this.isCasual = teamData.isCasual;
                this.memberData = Member.getMemberDataFromData(data);
                this.rep = teamData.rep;
                this.isCompliant = teamData.Compliant;
                if(this.isCompliant === false) {
                    this.ncData = getNcDataFromData(teamData);
                }
            }

            Team.prototype.setTeamLeader = function(teamLeaderData) {
                if(Array.isArray(teamLeaderData)) {
                    teamLeaderData = teamLeaderData[0];
                }
                this.teamLeader = Member.create(teamLeaderData);
            }

            Team.prototype.set2IC = function(secondInChargeData) {
                if(Array.isArray(secondInChargeData)) {
                    secondInChargeData = secondInChargeData[0];
                }
                this["2IC"] = Member.create(secondInChargeData);
            }

            Team.prototype.addRoster = function(rosterData) {
                let roster = Roster.create(rosterData);
                roster.team = this;
                this.rosters.push(roster);
            }

            Team.prototype.getAllTeamMembers = function() {
                let members = [];
                if(this.teamLeader !== undefined) {
                    members.push(this.teamLeader);
                }
                if(this["2IC"] !== undefined) {
                    members.push(this["2IC"]);
                }
                if(this.rosters !== undefined) {
                    for (let i = 0; i < this.rosters.length; i++) {
                        let roster = this.rosters[i];
                        let rosterMembers = roster.getAllRosterMembers();
                        members = members.concat(rosterMembers);
                    }
                }
                return members;
            }
            return new Team(data);
        }
    };
}]);

app.factory('Roster', ['Member', function(Member) {
    return {
        create: function(data) {
            function Roster(rosterData) {
                this.members = [];
                this.subs = [];
                if(rosterData.Members !== undefined) {
                    for (let i = 0; i < rosterData.Members.length; i++) {
                        let member = rosterData.Members[i];
                        this.addRosterMember(member);                        
                    }
                }
                if(rosterData.Subs !== undefined) {
                    for (let i = 0; i < rosterData.Subs.length; i++) {
                        let sub = rosterData.Subs[i];
                        this.addSubMember(sub);
                    }
                }
                this.setRosterLeader(rosterData.RL);
                this.isCasual = rosterData.isCasual;
                this.memberData = Member.getMemberDataFromData(rosterData);
                this.name = rosterData.name;
                this.isCompliant = rosterData.Compliant;
                if(this.isCompliant === false) {
                    this.ncData = getNcDataFromData(rosterData);
                }
            }

            Roster.prototype.setRosterLeader = function(rosterLeaderData) {
                if(rosterLeaderData !== undefined) {
                    if(Array.isArray(rosterLeaderData)) {
                        rosterLeaderData = rosterLeaderData[0];
                    }
                    rosterLeaderData.roster = this;
                    this.rosterLeader = Member.create(rosterLeaderData);
                }
            }

            Roster.prototype.addRosterMember = function(rosterMemberData) {
                let member = Member.create(rosterMemberData);
                member.roster = this;
                this.members.push(member);
            }

            Roster.prototype.addSubMember = function(subMemberData) {
                let sub = Member.create(subMemberData);
                sub.roster = this;
                this.subs.push(sub);
            }

            Roster.prototype.getAllRosterMembers = function() {
                let members = [];
                if(this.rosterLeader !== undefined) {
                    members.push(this.rosterLeader);
                }
                if(this.members !== undefined) {
                    members = members.concat(this.members);
                }
                if(this.subs !== undefined) {
                    members = members.concat(this.subs);
                }
                return members;
            }
            return new Roster(data);
        }
    };
}]);

app.factory('Member', [function() {
    return {
        create: function(data) {
            function Member(memberData) {
                if(memberData === undefined) {
                    return;
                }
                if(memberData.posts === undefined) {
                    memberData.posts = {};
                }
                if(memberData.rep === undefined) {
                    memberData.rep = {};
                }
                this.id = memberData.member_id;
                this.name = memberData.member_name;
                this.postData = {
                    current: memberData.member_posts,
                    thisMonth: parseInt(memberData.posts.acc_this_month),
                    lastMonth: parseInt(memberData.posts.acc_last_month)
                };
                this.group = memberData.member_group_id;
                this.joinedOn = memberData.member_joined_on;
                this.lastActivity = memberData.last_activity;
                this.isAway = (memberData.away === 1 ? true : false);
                this.eventData = {
                    attendedThisMonth: memberData.events_this_month,
                    hostedThisMonth: memberData.events_hosted_this_month,
                    attendedLastMonth: memberData.events_last_month,
                    hostedLastMonth: memberData.events_hosted_last_month,
                };
                this.repData = {
                    current: memberData.member_rep,
                    thisMonth: parseInt(memberData.rep.acc_this_month),
                    lastMonth: parseInt(memberData.rep.acc_last_month),
                };
                this.roster = memberData.roster;
                this.team = memberData.team;
                this.division = memberData.division;
                this.tsData = {
                    status: memberData.ts_status,
                    lastActive: memberData.ts_lastactive,
                    isOnline: (memberData.ts_online === 1 ? true : false),
                    lastUpdated: memberData.ts_updated,
                    isTsLinked: (memberData.ts_linked === 1 ? true : false)
                };
                this.memberRank = memberData.member_rank;
                this.position = memberData.position;
                this.positionFormatted = this.formattedPositionName();
                this.honorPoints = memberData.honor_points;
                this.recruitmemberData = {
                    recruitedThisMonth: memberData.recruits_this_month,
                    retainedThisMonth: memberData.recruits_retained_this_month,
                    qualityThisMonth: memberData.recruit_quality_this_month,
                    recruitedLastMonth: memberData.recruits_last_month,
                    retainedLastMonth: memberData.recruits_retained_last_month,
                    qualityLastMonth: memberData.recruit_quality_last_month,
                };
                this.country = memberData.country;
                this.house = memberData.house;
            }

            Member.prototype.formattedRosterName = function(){
                if(this.position === 'TL' || this.position === '2IC') {
                    return this.team;
                }
                else if(this.position === 'DV' || this.position === 'DC') {
                    return '';
                }
                else {
                    let teamName = this.team.replace('Team ', '');
                    let rosterName = this.roster.name.replace('Roster ', '');
                    return teamName + rosterName;
                }
            }

            Member.prototype.formattedPositionName = function(){  
                const roleMap = {
                    'SUB': 'Sub Player',
                    'TM': 'Member',
                    'RL': 'Roster Leader',
                    '2IC': '2IC',
                    'TL': 'Team Leader',
                    'DV': 'Vice',
                    'DC': 'Commander'
                };
                if(roleMap[this.position] !== undefined) {
                    return roleMap[this.position];
                }
                else {
                    return this.position;
                }
            }

            Member.prototype.roleImageName = function() {
                const roleMap = {
                    "Leader": 'leader',
                    "General": 'chancellor',
                    "DC": 'general',
                    "DV": 'commander',
                    "TL": 'commander'
                }
                return roleMap[this.position];
            }

            Member.prototype.roleCharacter = function() {
                const roleMap = {
                    "Warden": '♦',
                    "2IC": '♦',
                    "Guardian": '+',
                    "Champion": '+',
                    "Companion": '+',
                    "Mentor": '♥'
                };
                return roleMap[this.memberRank];
            }

            Member.prototype.roleCharacterColor = function() {
                const roleMap = {
                    "Warden": '#564062',
                    "2IC": '#564062',
                    "Guardian": '#b64240',
                    "Champion": '#b64240',
                    "Companion": '#b64240',
                    "Mentor": '#b64240'
                };
                return roleMap[this.memberRank];
            }

            return new Member(data);
        },
        getMemberDataFromData: function(data) {
            return {
                total: data.Count,
                officers: data["Officer-Count"],
                associates: data["Associate-Count"],
                wardens: data["Warden-Count"],
                initiates: data["Initiate-Count"],
                activeInLastFiveDays: data["Active-In-Last-5-Days-Count"]
            };
        }
    }
}]);

function getNcDataFromData(data) {
    let ncData = {};
    if(data.NCSince !== undefined) {
        ncData.ncSince = data.NCSince;
        ncData.ncSinceInDays = getTimeDifferenceInDays(ncData.ncSince);
    }
    if(data.NCReasons !== undefined) {
        ncData.reasons = [];
        for (let i = 0; i < data.NCReasons.length; i++) {
            let reason = data.NCReasons[i];
            let mappedData = {
                reason: reason.reason,
                isCausingUnit: (reason.causing_unit === 1 ? true : false),
                drainRate: reason.drainRate
            };
            ncData.reasons.push(mappedData);   
        }
    }
    return ncData;
}

function getTimeDifferenceInDays(milliseconds) {
	let date = new Date();
	date.setUTCHours(0);
	date.setUTCMinutes(0);
	let currentMilliseconds = date.valueOf();
	currentMilliseconds /= 1000;
	let secondsInDay = 60 * 60 * 24;
	let days = (currentMilliseconds - milliseconds) / secondsInDay;
	return parseInt(Math.round(days));
}

function getSdDataFromData(data) {
    let sdData = {};
    if(data.SDSince !== undefined) {
        sdData.sdSince = data.SDSince;
        sdData.sdSinceInDays = getTimeDifferenceInDays(sdData.SDSince);
    }
	return sdData;
}