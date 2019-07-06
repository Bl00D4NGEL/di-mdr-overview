import Member from './member';

export default class FirstCommander extends Member {
    static roleShort = 'FC';
    static roleLong = 'First Commander';
    static priority = 7;
}
