import { _decorator, Component, Node,Animation, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {
    @property({
        type: Node,
        tooltip: 'Character'
    })
    private character: Node;
    public get Character(): Node {
        return this.character;
    }
    public set Character(value: Node) {
        this.character = value;
    }

    @property({
        type: Node,
        tooltip: 'Jacket'
    })
    private jacket: Node;
    public get Jacket(): Node {
        return this.jacket;
    }
    public set Jacket(value: Node) {
        this.jacket = value;
    }

    @property({
        type: Node,
        tooltip: 'BulletAnimNode'
    })
    private bulletAnim: Node;
    public get BulletAnim(): Node {
        return this.bulletAnim;
    }
    public set BulletAnim(value: Node) {
        this.bulletAnim = value;
    }

    @property({
        type: Prefab,
        tooltip: 'Rocket Prefabs'
    })
    private rocketPrefabs: Prefab;
    public get RocketPrefabs(): Prefab {
        return this.rocketPrefabs;
    }
    public set RocketPrefabs(value: Prefab) {
        this.rocketPrefabs = value;
    }

    @property({
        type: Node,
        tooltip: 'Rocket Node'
    })
    private rocketNode: Node;
    public get RocketNode(): Node {
        return this.rocketNode;
    }
    public set RocketNode(value: Node) {
        this.rocketNode = value;
    }

    @property({
        type: Node,
        tooltip: 'Warning Node'
    })
    private warningNode: Node;
    public get WarningNode(): Node {
        return this.warningNode;
    }
    public set WarningNode(value: Node) {
        this.warningNode = value;
    }
//------------------Character Animtaion------------------------------------
    @property({
        type: Animation,
        tooltip: 'CharacterBody'
    })
    private characterAniHead: Animation;

    public get CharacterAniHead(): Animation {
        return this.characterAniHead;
    }
    public set CharacterAniHead(value: Animation) {
        this.characterAniHead = value;
    }

    @property({
        type: Animation,
        tooltip: 'CharacterBody'
    })
    private characterAniBody: Animation;

    public get CharacterAniBody(): Animation {
        return this.characterAniBody;
    }
    public set CharacterAniBody(value: Animation) {
        this.characterAniBody = value;
    }

    @property({
        type: Animation,
        tooltip: 'CharacterBody'
    })
    private characterAniJacket: Animation;

    public get CharacterAniJacket(): Animation {
        return this.characterAniJacket;
    }
    public set CharacterAniJacket(value: Animation) {
        this.characterAniJacket = value;
    }

    @property({
        type: Animation,
        tooltip: 'Bullet Flash'
    })
    private bulletFlash: Animation;
    public get BulletFlash(): Animation {
        return this.bulletFlash;
    }
    public set BulletFlash(value: Animation) {
        this.bulletFlash = value;
    }

    @property({
        type:Node,
        tooltip: 'BackGround Node'
    })
    private background:Node;
    
    public get Background(): Node {
        return this.background;
    }
    public set Background(value: Node) {
        this.background = value;
    }

    @property({
        type: Animation,
        tooltip: 'CharacterBody'
    })
    private skipTail: Animation;

    public get SkipTail(): Animation {
        return this.skipTail;
    }
    public set SkipTail(value: Animation) {
        this.skipTail = value;
    }

    @property({
        type: Animation,
        tooltip: 'CharacterBody'
    })
    private skipHead: Animation;

    public get SkipHead(): Animation {
        return this.skipHead;
    }
    public set SkipHead(value: Animation) {
        this.skipHead = value;
    }

    @property({
        type: Animation,
        tooltip: 'Skip Body'
    })
    private skipBody: Animation;

    public get SkipBody(): Animation {
        return this.skipBody;
    }
    public set SkipBody(value: Animation) {
        this.skipBody = value;
    }
}

