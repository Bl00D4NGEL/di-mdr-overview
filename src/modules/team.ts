import TeamLeader from './memberTypes/teamLeader';
import SecondInCharge from './memberTypes/secondInCharge';
import Roster from './roster';
import Commander from './memberTypes/commander';
import Vice from './memberTypes/vice';
import RosterLeader from './memberTypes/rosterLeader';
import Member from './memberTypes/member';
import Sub from './memberTypes/sub';

export default class Team {
    rosters: Roster[] = [];
    tls: TeamLeader[] = [];
    twoics: SecondInCharge[] = [];
    teamName = '';
    isCasual = false;
    reputation = 0;
    post = 0;
    count = 0;
    mobileDevicesLinked = 0;
    memberCount = 0;
    initiateCount = 0;
    associateCount = 0;
    wardenCount = 0;
    officerCount = 0;
    activeInLastFiveDays = 0;
    isCompliant = false;
    isCasualTeam = false;

    constructor(data?: any) {
        this.rosters = [];
        this.tls = [];
        this.twoics = [];
        if (data !== undefined) {
            this.parse(data);
        }
    }

    add(d: any): void {
        switch (d.constructor.name) {
            case 'Roster':
                this.rosters.push(d);
                break;
            case 'TeamLeader':
                this.tls.push(d);
                break;
            case 'SecondInCharge':
                this.twoics.push(d);
                break;
            default:
                break;
        }
    }

    parse(data: any): void {
        let dataAsJson;
        if (typeof data === 'string') {
            try {
                dataAsJson = JSON.parse(data);
            } catch (ex) {
                return ex;
            }
        } else {
            dataAsJson = data;
        }
// tslint:disable-next-line: forin
        for (const key in dataAsJson) {
            const d = dataAsJson[key];
            switch (key) {
                case 'Count':
                    this.count = d;
                    break;
                case 'Mobile-Device-Linked-Count':
                    this.mobileDevicesLinked = d;
                    break;
                case 'Warden-Count':
                    this.wardenCount = d;
                    break;
                case 'Active-In-Last-5-Days-Count':
                    this.activeInLastFiveDays = d;
                    break;
                case 'rep':
                    this.reputation = d;
                    break;
                case 'posts':
                    this.post = d;
                    break;
                case 'Officer-Count':
                    this.officerCount = d;
                    break;
                case 'Member-Count':
                    this.memberCount = d;
                    break;
                case 'Initiate-Count':
                    this.initiateCount = d;
                    break;
                case 'Associate-Count':
                    this.associateCount = d;
                    break;
                case 'name':
                    this.teamName = d;
                    break;
                case 'Compliant':
                    this.isCompliant = d;
                    break;
                case 'isCasual':
                    this.isCasualTeam = d;
                    break;
                case 'TL':
// tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < d.length; i++) {
                        const tl = new TeamLeader(d[i]);
                        this.add(tl);
                    }
                    break;
                case '2IC':
// tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < d.length; i++) {
                        const secondInCharge = new SecondInCharge(d[i]);
                        this.add(secondInCharge);
                    }
                    break;
                case 'Rosters':
// tslint:disable-next-line: forin
                    for (const rosterName in d) {
                        const roster = new Roster(d[rosterName]);
                        this.add(roster);
                    }
                    break;
                default:
                    if (typeof this[key] !== undefined) {
                        this[key] = d;
                    } else {
                        console.log('???', d, key, this[key]);
                    }
                    break;
            }
        }
    }

    generateTagListForRoles(roles: string[]): string {
        const roleMap = {
            DC: Commander,
            DV: Vice,
            TL: TeamLeader,
            '2IC': SecondInCharge,
            RL: RosterLeader,
            TM: Member,
            SUB: Sub,
        };
        const rosterRoles = ['RL', 'TM', 'SUB'];
        let loadedRoster = false;
// tslint:disable-next-line: only-arrow-functions
        const sortedRoles = roles.sort(function(a, b) {
            return roleMap[b].priority - roleMap[a].priority;
        });
        let out: string = '<div><h2>' + this.teamName + '</h2>';

// tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < sortedRoles.length; i++) {
            const role: string = sortedRoles[i];

            if (rosterRoles.includes(role) && !loadedRoster) {
// tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < this.rosters.length; j++) {
                    const roster = this.rosters[j];
                    out += roster.generateTagListForRoles(roles);
                }
                loadedRoster = true;
            }

            let vals: Member[] = [];
            switch (role) {
                case 'TL':
                    vals = this.tls;
                    break;
                case '2IC':
                    vals = this.twoics;
                    break;
                default:
                    continue;
            }

            if (vals.length > 0) {
                out +=
                    '<span class=\'role\'>' +
                    roleMap[role].roleLong +
                    (vals.length > 1 ? 's (' + vals.length.toString() + ')' : '') +
                    '</span><br>';
// tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < vals.length; j++) {
                    const val = vals[j];
                    out += this.fillTagTemplate(val.id, val.name);
                }
                out += '<br>';
            }
        }
        out += '</div>';
        return out;
    }

    fillTagTemplate(id: number, name: string): string {
        const template =
// tslint:disable-next-line: max-line-length
            '<a href="https://di.community/profile/##id##-##name##/" contenteditable="false" data-ipshover="" data-ipshover-target="https://di.community/profile/##id##-##name##/?do=hovercard" data-mentionid="##id##">@##name##</a>&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203&nbsp';
        return template.replace(/##id##/g, id.toString()).replace(/##name##/g, name);
    }

    getMembers(): Array<Member> {
      let membersAny: Array<any> = [];
      let members: Array<Member> = [];

      this.rosters.map(roster => {
        roster = new Roster(roster);
        members = members.concat(roster.getMembers());
      });

      membersAny = membersAny.concat(this.tls);
      membersAny = membersAny.concat(this.twoics);
      membersAny.map(x => {
        x = new Member(x);
        members.push(x);
      });
      return members;
    }
}
