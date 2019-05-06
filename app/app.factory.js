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
                this.houseGenerals = [];
                this.firstCommanders = [];
                this.addHouseGeneral(houseData["House General"]);
                this.addFirstCommander(houseData["First Commander"]);
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

            House.prototype.addFirstCommander = function(firstCommanderData) {
                if(firstCommanderData !== undefined) {
                    if(Array.isArray(firstCommanderData)) {
                        let firstCommanders = Member.createBatch(firstCommanderData);
                        this.firstCommanders = this.firstCommanders.concat(firstCommanders);
                    }
                    else{
                        let firstCommander = Member.create(firstCommanderData);
                        this.firstCommanders.push(firstCommander);
                    }
                }
            }

            House.prototype.addHouseGeneral = function(houseGeneralData) {
                if(houseGeneralData !== undefined) {
                    if(Array.isArray(houseGeneralData)) {
                        let houseGenerals = Member.createBatch(houseGeneralData);
                        this.houseGenerals = this.houseGenerals.concat(houseGenerals);
                    }
                    else{
                        let houseGeneral = Member.create(houseGeneralData);
                        this.houseGenerals.push(houseGeneral);
                    }
                }
            }

            House.prototype.addDivision = function(divisionData) {
                let div = Division.create(divisionData);
                div.house = this;
                this.divisions.push(div);
            }

            House.prototype.getAllHouseMembers = function() {
                let members = [];
                let divisionMap = {};
                if(this.divisions !== undefined) {
                    for (let i = 0; i < this.divisions.length; i++) {
                        let division = this.divisions[i];
                        divisionMap[division.nameShort] = division;
                        let divisionMembers = division.getAllDivisionMembers();
                        members = members.concat(divisionMembers);
                    }
                }
                if(this.firstCommanders !== undefined) {
                    this.firstCommanders.map((x) => {x.divisionColor = divisionMap[x.divisionShort].color});
                    members = members.concat(this.firstCommanders);
                }
                if(this.houseGenerals !== undefined) {
                    this.houseGenerals.map((x) => {x.divisionColor = divisionMap[x.divisionShort].color});
                    members = members.concat(this.houseGenerals);
                }
                return members;
            }

            House.prototype.getHouseNcData = function() {
                let ncData = [];
                if(this.divisions !== undefined) {
                    for (let i = 0; i < this.divisions.length; i++) {
                        let divison = this.divisions[i];
                        let divisonNcData = divison.ncData;
                        if(divisonNcData !== undefined) {
                            divisonNcData.cause = "DI-" + divison.name;
                            ncData.push(divisonNcData);
                        }
                    }
                }
                return ncData;
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
                this.vices = [];
                this.commanders = [];
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
                this.addVice(divisionData.Vice);
                this.addCommander(divisionData.Commander);
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

            Division.prototype.addVice = function(viceData) {
                if(viceData !== undefined) {
                    if(Array.isArray(viceData)) {
                        let vices = Member.createBatch(viceData);
                        this.vices = this.vices.concat(vices);
                    }
                    else{
                        let vice = Member.create(viceData);
                        this.vices.push(vice);
                    }
                }
            }

            Division.prototype.addCommander = function(commanderData) {
                if(commanderData !== undefined) {
                    if(Array.isArray(commanderData)) {
                        let commanders = Member.createBatch(commanderData);
                        this.commanders = this.commanders.concat(commanders);
                    }
                    else{
                        let commander = Member.create(commanderData);
                        this.commanders.push(commander);
                    }
                }
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
                let self = this;
                if(this.commanders !== undefined) {
                    members = members.concat(this.commanders);
                }
                if(this.vices !== undefined) {
                    members = members.concat(this.vices);
                }
                if(this.teams !== undefined) {
                    for (let i = 0; i < this.teams.length; i++) {
                        let team = this.teams[i];
                        let teamMembers = team.getAllTeamMembers();
                        members = members.concat(teamMembers);                        
                    }
                }
                members.map((x) => {x.divisionColor = self.color;});
                return members;
            }

            Division.prototype.getDivsionNcData = function() {
                let ncData = [];
                if(this.teams !== undefined) {
                    for (let i = 0; i < this.teams.length; i++) {
                        let team = this.teams[i];
                        let teamNcData = team.ncData;
                        if(teamNcData !== undefined) {
                            teamNcData.cause = team.name;
                            ncData.push(teamNcData);
                        }
                    }
                }
                return ncData;
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
                this.teamLeaders = [];
                this["2ICs"] = [];
                this.add2IC(teamData["2IC"]);
                this.addTeamLeader(teamData.TL);
                this.name = teamData.name;
                this.isCasual = teamData.isCasual;
                this.memberData = Member.getMemberDataFromData(data);
                this.rep = teamData.rep;
                this.isCompliant = teamData.Compliant;
                if(this.isCompliant === false) {
                    this.ncData = getNcDataFromData(teamData);
                }
            }

            Team.prototype.addTeamLeader = function(teamLeaderData) {
                if(teamLeaderData !== undefined) {
                    if(Array.isArray(teamLeaderData)) {
                        let teamLeaders = Member.createBatch(teamLeaderData);
                        this.teamLeaders = this.teamLeaders.concat(teamLeaders);
                    }
                    else{
                        let teamLeader = Member.create(teamLeaderData);
                        this.teamLeaders.push(teamLeader);
                    }
                }
            }

            Team.prototype.add2IC = function(secondInChargeData) {
                if(secondInChargeData !== undefined) {
                    if(Array.isArray(secondInChargeData)) {
                        let twoICs = Member.createBatch(secondInChargeData);
                        this["2ICs"] = this["2ICs"].concat(twoICs);
                    }
                    else{
                        let twoIC = Member.create(secondInChargeData);
                        this["2ICs"].push(twoIC);
                    }
                }
            }

            Team.prototype.addRoster = function(rosterData) {
                let roster = Roster.create(rosterData);
                roster.team = this;
                this.rosters.push(roster);
            }

            Team.prototype.getAllTeamMembers = function() {
                let members = [];
                if(this.teamLeaders !== undefined) {
                    members = members.concat(this.teamLeaders);
                }
                if(this["2ICs"] !== undefined) {
                    members = members.concat(this["2ICs"]);
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

            Team.prototype.getTeamNcData = function() {
                let ncData = [];
                if(this.rosters !== undefined) {
                    for (let i = 0; i < this.rosters.length; i++) {
                        let roster = this.rosters[i];
                        let rosterNcData = roster.ncData;
                        if(rosterNcData !== undefined) {
                            rosterNcData.cause = roster.name;
                            ncData.push(rosterNcData);
                        }
                    }
                }
                return ncData;
            }
            return new Team(data);
        }
    };
}]);

app.factory('Roster', ['Member', function(Member) {
    return {
        create: function(data) {
            function Roster(rosterData) {
                this.rosterLeaders = [];
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
                this.addRosterLeader(rosterData.RL);
                this.isCasual = rosterData.isCasual;
                this.memberData = Member.getMemberDataFromData(rosterData);
                this.name = rosterData.name;
                this.isCompliant = rosterData.Compliant;
                if(this.isCompliant === false) {
                    this.ncData = getNcDataFromData(rosterData);
                }
            }

            Roster.prototype.addRosterLeader = function(rosterLeaderData) {
                if(rosterLeaderData !== undefined) {
                    if(Array.isArray(rosterLeaderData)) {
                        let rosterLeaders = Member.createBatch(rosterLeaderData);
                        rosterLeaders.map((x) => {x.roster = this;});
                        this.rosterLeaders = this.rosterLeaders.concat(rosterLeaders);
                    }
                    else{
                        let rosterLeader = Member.create(rosterLeaderData);
                        rosterLeader.roster = this;
                        this.rosterLeaders.push(rosterLeader);
                    }
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
                if(this.rosterLeaders !== undefined) {
                    members = members.concat(this.rosterLeaders);
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
                this.divisionShort = this.division.replace("DI-", "");
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
                this.honorPoints = parseInt(memberData.honor_points);
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
                else if(this.position === 'DV' || this.position === 'DC' || this.position === 'FC' || this.position === 'HG') {
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
                    'DC': 'Commander',
                    'HG': 'House General',
                    'FC': 'First Commander'
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
                    'HG': 'chancellor',
                    'FC': 'general',
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
                return {color: roleMap[this.memberRank]};
            }
            return new Member(data);
        },
        createBatch: function(batchData) {
            let objects = [];
            if(Array.isArray(batchData)) {
                for (let i = 0; i < batchData.length; i++) {
                    let data = batchData[i];
                    objects.push(new this.create(data));
                }
            }
            return objects;
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
        },
        getRoleValues: function() {
            const roleValues = {
                'Sub Player': 0,
                'Member': 1,
                'Roster Leader': 2,
                '2IC': 3,
                'Team Leader': 4,
                'Vice': 5,
                'Commander': 6,
                'First Commander': 7,
                'House General': 8
            };
            return roleValues;
        }
    }
}]);

function getNcDataFromData(data) {
    let ncData = {};
    if(data.NCSince !== undefined) {
        ncData.ncSince = data.NCSince;
        ncData.ncSinceInDays = getTimeDifferenceInDays(ncData.ncSince * 1000);
    }
    if(data.NCReasons !== undefined) {
        ncData.reasons = [];
        for (let i = 0; i < data.NCReasons.length; i++) {
            let reason = data.NCReasons[i];
            let mappedData = {
                reason: reason.reason,
                isCausingUnit: (reason.causing_unit === 1 ? true : false),
                drainRate: reason.drain_rate,
            };
            ncData.reasons.push(mappedData);
        }
    }
    return ncData;
}

function getTimeDifferenceInDays(milliseconds) {
    let today = new Date();
    let diffDate = new Date(milliseconds);
    let oneDay = 1000 * 60 * 60 * 24;
    let todayMs = today.getTime();
    let diffDateMs = diffDate.getTime();
    let diffMs = todayMs - diffDateMs;
    let diffDays = Math.floor(diffMs/oneDay);
    if (diffDays < 0) {
        diffDays = 0;
    }
    console.log(milliseconds, today.valueOf(), diffDate.valueOf(), today.toLocaleString(), diffDate.toLocaleString(), diffDays);
    return diffDays;
    /*
	date.setUTCHours(0);
	date.setUTCMinutes(0);
	let currentMilliseconds = date.valueOf();
	currentMilliseconds /= 1000;
	let secondsInDay = 60 * 60 * 24;
    let days = (currentMilliseconds - milliseconds) / secondsInDay;
    let parsed = parseInt(Math.round(days));
    if(parsed <= 0) { // TODO: Fix
        parsed = 1;
    }
    return parsed;
    */
}

function getSdDataFromData(data) {
    let sdData = {};
    if(data.SDSince !== undefined) {
        sdData.sdSince = data.SDSince;
        sdData.sdSinceInDays = getTimeDifferenceInDays(sdData.SDSince * 1000);
    }
	return sdData;
}