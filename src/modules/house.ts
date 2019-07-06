import Division from './division';
import FirstCommander from './memberTypes/firstCommander';
import HouseGeneral from './memberTypes/houseGeneral';
import Member from './memberTypes/member';

export default class House {
    divisions: Division[] = [];
    firstCommanders: FirstCommander[] = [];
    houseGenerals: HouseGeneral[] = [];
    houseName = '';
    fileName = '';
    sortingNumber = 0;
    color = '';
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

    constructor(data?: any) {
        this.divisions = [];
        this.firstCommanders = [];
        this.houseGenerals = [];
        if (data !== undefined) {
            this.parse(data);
        }
    }

    add(d: any): void {
        switch (d.constructor.name) {
            case 'Division':
                this.divisions.push(d);
                break;
            case 'FirstCommander':
                this.firstCommanders.push(d);
                break;
            case 'HouseGeneral':
                this.houseGenerals.push(d);
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
                case 'sorting_number':
                    this.sortingNumber = d;
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
                    this.houseName = d;
                    break;
                case 'Compliant':
                    this.isCompliant = d;
                    break;
                case 'First Commander':
// tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < d.length; i++) {
                        const mem = new FirstCommander(d[i]);
                        this.add(mem);
                    }
                    break;
                case 'House General':
// tslint:disable-next-line: prefer-for-of
                    for (let i = 0; i < d.length; i++) {
                        const mem = new HouseGeneral(d[i]);
                        this.add(mem);
                    }
                    break;
                case 'Divisions':
// tslint:disable-next-line: forin
                    for (const divisionName in d) {
                        const div = new Division(d[divisionName]);
                        this.add(div);
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

    shortHouseName(name?: string): string {
      if (name === undefined && this.houseName !== undefined) {
        name = this.houseName;
      }
      name = name.replace('House - ', '');
      return name;
    }

    getDivisionNames(): string[] {
        const names = [];
// tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.divisions.length; i++) {
            const div = this.divisions[i];
            names.push(div.divisionName);
        }
        return names;
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

      this.divisions.map(division => {
        division = new Division(division);
        members = members.concat(division.getMembers());
      });

      membersAny = membersAny.concat(this.houseGenerals);
      membersAny = membersAny.concat(this.firstCommanders);
      membersAny.map(x => {
        x = new Member(x);
        members.push(x);
      });
      return members;
    }
}
