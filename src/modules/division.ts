import Team from './team';
import Commander from './memberTypes/commander';
import Vice from './memberTypes/vice';
import TeamLeader from './memberTypes/teamLeader';
import SecondInCharge from './memberTypes/secondInCharge';
import RosterLeader from './memberTypes/rosterLeader';
import Member from './memberTypes/member';
import Sub from './memberTypes/sub';

export default class Division {
    teams: Team[] = [];
    commanders: Commander[] = [];
    vices: Vice[] = [];
    divisionName = '';
    houseName = '';
    fileName = '';
    color = '';
    game = '';
    count = 0;
    mobileDevicesLinked = 0;
    memberCount = 0;
    initiateCount = 0;
    associateCount = 0;
    wardenCount = 0;
    officerCount = 0;
    activeInLastFiveDays = 0;
    reputation = 0;
    post = 0;
    isCompliant = false;
    isCommunityDivision = false;
    isRepDrainEnabled = false;
    isSuperDivision = false;
    isSeedDivision = false;

    constructor(data?: any) {
        this.teams = [];
        this.commanders = [];
        this.vices = [];
        if (data !== undefined) {
            this.parse(data);
        }
    }

    add(d: any): void {
        switch (d.constructor.name) {
            case 'Team':
                this.teams.push(d);
                break;
            case 'Vice':
                this.vices.push(d);
                break;
            case 'Commander':
                this.commanders.push(d);
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
                case 'Game':
                    this.game = d.name;
                    break;
                case 'color':
                    this.color = d;
                    break;
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
                    this.divisionName = d;
                    if (d.match(/^C/)) {
                        this.isCommunityDivision = true;
                    } else {
                        this.isCommunityDivision = false;
                    }
                    break;
                case 'House':
                    this.houseName = d;
                    break;
                case 'Compliant':
                    this.isCompliant = d;
                    break;
                case 'is_seed':
                    this.isSeedDivision = d;
                    break;
                case 'Super':
                    this.isSuperDivision = d;
                    break;
                case 'rep_drain_enabled':
                    if (d === 0) {
                        this.isRepDrainEnabled = true;
                    } else {
                        this.isRepDrainEnabled = false;
                    }
                    break;
                case 'Commander':
// tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < d.length; i++) {
                        const dc = new Commander(d[i]);
                        this.add(dc);
                    }
                    break;
                case 'Vice':
// tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < d.length; i++) {
                        const dv = new Vice(d[i]);
                        this.add(dv);
                    }
                    break;
                case 'Teams':
// tslint:disable-next-line: forin
                    for (const teamName in d) {
                        const team = new Team(d[teamName]);
                        this.add(team);
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
        const teamRoles = ['TL', '2IC', 'RL', 'TM', 'SUB'];
// tslint:disable-next-line: only-arrow-functions
        const sortedRoles = roles.sort(function(a, b) {
            return roleMap[b].priority - roleMap[a].priority;
        });

        let out: string = '<div><h1>Division ' + this.divisionName + '</h1>';
        let loadedTeam = false;

// tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < sortedRoles.length; i++) {
            const role: string = sortedRoles[i];

            if (teamRoles.includes(role) && !loadedTeam) {
// tslint:disable-next-line: prefer-for-of
                for (let j = 0; j < this.teams.length; j++) {
                    const team = this.teams[j];
                    if (team.teamName === 'Unassigned') {
                        continue;
                    }
                    out += team.generateTagListForRoles(roles);
                }
                loadedTeam = true;
            }

            let vals: Member[] = [];
            switch (role) {
                case 'DC':
                    vals = this.commanders;
                    break;
                case 'DV':
                    vals = this.vices;
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

    getGameImageName(game?: string) {
      if (game === undefined && this.game !== undefined) {
        game = this.game;
      }
      const gameMapper = {
          'League of Legends': 'lol',
          // tslint:disable-next-line: object-literal-key-quotes
          'Fortnite': 'fortnite',
          // tslint:disable-next-line: object-literal-key-quotes
          'Rust': 'rust',
          'Apex Legends': 'apex',
          'Rocket League': 'rocket-league',
          'Counter Strike': 'csgo',
          'DOTA 2': 'dota2',
          // tslint:disable-next-line: object-literal-key-quotes
          'Overwatch': 'overwatch',
          'Rainbow Six Siege': 'r6',
          // tslint:disable-next-line: object-literal-key-quotes
          'Various': 'community'
      };
      return gameMapper[game];
    }

    shortDivisionName(name?: string): string {
      if (name === undefined && this.divisionName !== undefined) {
        name = this.divisionName;
      }
      name = name.replace('DI-', '');
      return name;
    }

    shortHouseName(name?: string): string {
      if (name === undefined && this.houseName !== undefined) {
        name = this.houseName;
      }
      name = name.replace('House - ', '');
      return name;
    }

    getTotalMemberCount(): number {
      const normals = this.memberCount;
      const initiates = this.initiateCount;
      const officers = this.officerCount;
      const wardens = this.wardenCount;
      const associates = this.associateCount;
      return normals + initiates + officers + wardens + associates;
    }

    getMembers(): Array<Member> {
      let members: Array<Member> = [];
      let membersAny: Array<any> = [];

      this.teams.map(team => {
        team = new Team(team);
        members = members.concat(team.getMembers());
      });

      membersAny = membersAny.concat(this.commanders);
      membersAny = membersAny.concat(this.vices);
      membersAny.map(x => {
        x = new Member(x);
        members.push(x);
      });
      return members;
    }
}
