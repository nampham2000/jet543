import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;
export type DataUser = {
    highScore: number,
    checkfirst:boolean,
    checkLog: Object
}

@ccclass('Constants')
export class Constants extends Component {
    public static readonly bulletPrefab1: string = 'bullet';
    public static readonly bulletPrefab2: string = 'bulletx2';
    public static readonly glowPrefab: string = 'Glow';
    public static readonly glowOffPrefab: string = 'Glowoff';
    public static readonly bulletAnim: string = 'BulletAnim';
    public static readonly Rocket: string = 'Rocket';

    public static readonly NODE_NAME = {
        GameClient: 'GameClient'
    }

    public static dataUser: DataUser = {
        highScore: 0,
        checkfirst: false,
        checkLog: {}
    }
}

