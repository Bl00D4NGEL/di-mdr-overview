import Member from './memberTypes/member';
import Sub from './memberTypes/sub';
import RosterLeader from './memberTypes/rosterLeader';
import TeamLeader from './memberTypes/teamLeader';
import SecondInCharge from './memberTypes/secondInCharge';
import Commander from './memberTypes/commander';
import Vice from './memberTypes/vice';

export default class Roster {
    members: Member[] = [];
    subs: Sub[] = [];
    rls: RosterLeader[] = [];
    rosterName = '';
    count = 0;
    mobileDevicesLinked = 0;
    memberCount = 0;
    initiateCount = 0;
    associateCount = 0;
    wardenCount = 0;
    activeInLastFiveDays = 0;
    isCompliant = false;

    constructor(data?: any) {
        this.members = [];
        this.subs = [];
        this.rls = [];
        if (data !== undefined) {
            this.parse(data);
        }
    }

    add(d: any): void {
        switch (d.constructor.name) {
            case 'Member':
                this.members.push(d);
                break;
            case 'Sub':
                this.subs.push(d);
                break;
            case 'RosterLeader':
                this.rls.push(d);
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
                    this.rosterName = d;
                    break;
                case 'Compliant':
                    this.isCompliant = d;
                    break;
                case 'RL':
// tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < d.length; i++) {
                        const rl = new RosterLeader(d[i]);
                        this.add(rl);
                    }
                    break;
                case 'Members':
// tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < d.length; i++) {
                        const mem = new Member(d[i]);
                        this.add(mem);
                    }
                    break;
                case 'Subs':
// tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < d.length; i++) {
                        const sub = new Sub(d[i]);
                        this.add(sub);
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
// tslint:disable-next-line: only-arrow-functions
        const sortedRoles = roles.sort(function(a, b) {
            return roleMap[b].priority - roleMap[a].priority;
        });
        let out: string = '<div><h3>' + this.rosterName + '</h3>';

// tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < sortedRoles.length; i++) {
            const role: string = sortedRoles[i];

            let vals: Member[] = [];
            switch (role) {
                case 'RL':
                    vals = this.rls;
                    break;
                case 'TM':
                    vals = this.members;
                    break;
                case 'SUB':
                    vals = this.subs;
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
      const members: Array<Member> = [];
      membersAny = membersAny.concat(this.rls);
      membersAny = membersAny.concat(this.members);
      membersAny = membersAny.concat(this.subs);
      membersAny.map(x => {
        x = new Member(x);
        members.push(x);
      });
      return members;
    }
}
