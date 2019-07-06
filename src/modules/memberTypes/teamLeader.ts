import Member from './member';

export default class TeamLeader extends Member {
    static roleShort = 'TL';
    static roleLong = 'Team Leader';
    static priority = 4;
}
