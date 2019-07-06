import Teamspeak from '../utils/teamspeak';
import ThisAndLastMonthAndTotal from '../utils/thisAndLastMonthAndTotal';
import Event from '../utils/event';
import Recruitment from '../utils/recruitment';

export default class Member {
  static roleShort = 'TM';
  static roleLong = 'Member';
  static maxTsInactivity = 7;
  static maxForumInactivity = 5;
  static priority = 1;
    name = '';
    id = 0;
    posts = 0;
    rep = 0;
    groupId = 0;
    joinedOn = 0;
    lastActivity = 0;
    isAway = false;
    isMobileLinked = false;
    rank = '';
    position = '';
    honorPoints = 0;
    country = '';
    memberRank = '';

    postData?: ThisAndLastMonthAndTotal = new ThisAndLastMonthAndTotal();
    eventData?: Event = new Event();
    repData?: ThisAndLastMonthAndTotal = new ThisAndLastMonthAndTotal();
    recruitmentData?: Recruitment = new Recruitment();
    tsData?: Teamspeak = new Teamspeak();

    house = '';
    roster = '';
    team = '';
    division = '';

    constructor(data?: any) {
        if (data !== undefined) {
            this.parse(data);
        }
    }

    parse(data: any): void {
        let dataAsJson;
        if (typeof data === 'string') {
            try {
                dataAsJson = JSON.parse(data);
            } catch (ex) {
                console.log(ex);
                return ex;
            }
        } else {
            dataAsJson = data;
        }
// tslint:disable-next-line: forin
        for (const key in dataAsJson) {
            const d = dataAsJson[key];
            switch (key) {
                case 'member_id':
                    this.id = d;
                    break;
                case 'member_name':
                    this.name = d;
                    break;
                case 'member_posts':
                    this.posts = d;
                    break;
                case 'member_group_id':
                    this.groupId = d;
                    break;
                case 'member_joined_on':
                    this.joinedOn = d;
                    break;
                case 'member_rank':
                    this.memberRank = d;
                    break;
                case 'last_activity':
                    this.lastActivity = d;
                    break;
                case 'away':
                    this.isAway = (d === 1);
                    break;
                case 'events_this_month':
                    this.eventData.attended.thisMonth = d;
                    break;
                case 'events_last_month':
                    this.eventData.attended.lastMonth = d;
                    break;
                case 'events_hosted_this_month':
                    this.eventData.hosted.thisMonth = d;
                    break;
                case 'events_hosted_last_month':
                    this.eventData.hosted.lastMonth = d;
                    break;
                case 'member_rep':
                    this.rep = d;
                    break;
                case 'country':
                    this.country = d;
                    break;
                case 'roster':
                    this.roster = d;
                    break;
                case 'ts_status':
                    this.tsData.status = d;
                    break;
                case 'ts_lastactive':
                    this.tsData.lastActive = d;
                    break;
                case 'ts_online':
                    this.tsData.isOnline = (d === 1);
                    break;
                case 'ts_updated':
                    this.tsData.lastUpdated = d;
                    break;
                case 'ts_linked':
                    this.tsData.isTsLinked = (d === 1);
                    break;
                case 'division':
                    this.division = d;
                    break;
                case 'team':
                    this.team = d;
                    break;
                case 'honor_points':
// tslint:disable-next-line: radix
                    this.honorPoints = parseInt(d);
                    break;
                case 'recruits_this_month':
                    this.recruitmentData.recruited.thisMonth = d;
                    break;
                case 'recruits_last_month':
                    this.recruitmentData.recruited.lastMonth = d;
                    break;
                case 'recruits_retained_this_month':
                    this.recruitmentData.retained.thisMonth = d;
                    break;
                case 'recruits_retained_last_month':
                    this.recruitmentData.recruited.lastMonth = d;
                    break;
                case 'recruit_quality_this_month':
                    this.recruitmentData.quality.thisMonth = d;
                    break;
                case 'recruit_quality_last_month':
                    this.recruitmentData.quality.lastMonth = d;
                    break;
                case 'mobile_linked':
                    this.isMobileLinked = d;
                    break;
                case 'house':
                    this.house = d;
                    break;
                case 'rep':
                    const repData = d;
                    // tslint:disable-next-line: radix
                    this.repData.total = repData.last_month + parseInt(repData.acc_this_month);
                    // tslint:disable-next-line: radix
                    this.repData.lastMonth = parseInt(repData.acc_last_month);
                    // tslint:disable-next-line: radix
                    this.repData.thisMonth = parseInt(repData.acc_this_month);
                    break;
                case 'posts':
                    const postData = d;
                    // tslint:disable-next-line: radix
                    this.postData.total = postData.last_month + parseInt(postData.acc_this_month);
                    this.postData.lastMonth = postData.acc_last_month;
                    this.postData.thisMonth = postData.acc_this_month;
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

    roleCharacterColor(memberRank?: string): string {
        if (memberRank === undefined && this.memberRank !== '') {
            memberRank = this.memberRank;
        }
        const roleMap = {
            Warden: '#564062',
            Guardian: '#b64240',
            Champion: '#b64240',
            Companion: '#b64240',
            Mentor: '#b64240'
        };
        return roleMap[memberRank];
    }

    roleCharacter(memberRank?: string): string {
        if (memberRank === undefined && this.memberRank !== '') {
            memberRank = this.memberRank;
        }
        const roleMap = {
            Warden: '♦',
            Guardian: '+',
            Champion: '+',
            Companion: '+',
            Mentor: '♥'
        };
        return roleMap[memberRank];
    }

    roleImageName(roleShort?: string): string {
        if (roleShort === undefined && Member.roleShort !== '') {
            roleShort = Member.roleShort;
        }
        const roleMap = {
            Leader: 'leader',
            HG: 'chancellor',
            FC: 'general',
            DC: 'general',
            DV: 'commander',
            TL: 'commander'
        };
        return roleMap[this.position];
    }

    formattedRosterName(): string {
        let out = '';
        const pos = this.position;
        const teamOnly = ['2IC', 'TL'];
        const noRoster = ['DV', 'DC', 'FC', 'HG'];
        if (teamOnly.includes(pos)) {
            out = this.team;
        } else if (noRoster.includes(pos)) {
            out = '';
        } else {
            if (this.team !== 'Unassigned') {
                out += this.team.replace('Team ', '');
            }
            if (this.roster !== 'Not Set') {
                out += this.roster.replace('Roster ', '');
            }
        }
        return out;
    }

    getForumLastActiveAsDate(): Date {
      return new Date(this.lastActivity * 1000);
    }

    getTeamspeakLastActiveAsDate(): Date {
      return new Date(this.tsData.lastActive * 1000);
    }

    getFormattedName(): string {
      const roleMap = {
          SUB: 'Sub Player',
          TM: 'Member',
          RL: 'Roster Leader',
          '2IC': '2IC',
          TL: 'Team Leader',
          DV: 'Vice',
          DC: 'Commander',
          FC: 'First Commander',
          HG: 'House General'
      };
      if (this.position !== undefined) {
        return roleMap[this.position];
      } else {
        return '';
      }
  }
}
