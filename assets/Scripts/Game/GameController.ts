import { _decorator, CCInteger, Collider2D, Component, Contact2DType, Input, input, IPhysics2DContact, math, Node, Prefab, Quat, RigidBody2D, Vec2, Vec3, Animation, cclegacy, log, director, tiledLayerAssembler, BoxCollider2D, tween, instantiate, view, Label, AudioSource, randomRangeInt, Camera, quat, UITransform } from 'cc';
import { GameModel } from './GameModel';
import { ObjectPool } from '../Pool/ObjectPool';
import { NodeCustom } from '../Pool/NodeCustom';
import { Constants } from '../Data/Constants';
import { GameCenterController } from '../GameCenterController/GameCenterController';
import { AudioController } from '../AudioController/AudioController';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property({
        type: GameModel,
        tooltip: 'GameModel'
    })
    private gameModel: GameModel;

    @property({
        type: Prefab,
        tooltip: 'Bullet'
    })
    private bullet: Prefab;

    @property({
        type: Prefab,
        tooltip: 'Bullet Animation Hit'
    })
    private bulletAnim: Prefab;

    @property({
        type: Node,
        tooltip: 'Bulllet Node'
    })
    private BulletNode: Node;

    @property({
        type: Prefab,
        tooltip: 'Glow Prefab'
    })
    private glow: Prefab;

    @property({
        type: Prefab,
        tooltip: 'Glow Off Prefab'
    })
    private glowOff: Prefab;

    @property({
        type: Node,
        tooltip: 'Glow Node'
    })
    private glowNode: Node;

    @property({
        type: Node,
        tooltip: 'Glow Node'
    })
    private glowOffNode: Node;
    @property({
        type: CCInteger
    })
    private firerate: number = 200;

    @property({
        type: Node
    })
    private land: Node;

    @property({
        type: Node
    })
    private background1: Node;

    @property({
        type: Node
    })
    private background2: Node;

    @property({
        type: Node
    })
    private checkPoint2: Node;

    @property({
        type: Node
    })
    private Skip: Node;

    @property({
        type: Node
    })
    private SkipNode: Node;

    @property({
        type: CCInteger
    })
    private firerateRocket: number = 10000;

    @property({
        type: GameCenterController,
        tooltip: 'Game Center'
    })
    private gameCenter: GameCenterController;

    @property({
        type: Node
    })
    private title: Node;

    @property({
        type: Node
    })
    private OverPandel: Node;

    @property({
        type: Animation
    })
    private LightAni: Animation;

    @property({
        type: RigidBody2D
    })
    private charRigi: RigidBody2D;

    @property(Node)
    private Head: Node;

    @property(Node)
    private checkGlowScreen: Node;

    @property(Node)
    private Setting: Node;

    @property(Node)
    private SettingIcon: Node;

    @property(Label)
    private ScoreCur: Label;

    @property(Label)
    private ScoreEnd: Label;

    @property(Node)
    private Skill: Node;

    @property(Animation)
    private Clock: Animation;

    @property(Node)
    private FireRobot: Node;

    @property(Node)
    private GrayAsset: Node;

    @property(Node)
    private Door: Node;

    @property(Node)
    private Camera2d: Node;

    @property(Node)
    private CameraUi: Node;

    @property(Node)
    private CameraRender: Node;

    @property(Node)
    private OverLabel: Node;

    @property(Node)
    private parentNode: Node = null;


    @property(Animation)
    private GrayAssetChild: Animation;

    @property(Animation)
    private SmokeRobot: Animation;

    @property(Animation)
    private appear: Animation;

    @property(Animation)
    private appearObject: Animation;

    @property(Animation)
    private appearLabel: Animation;

    @property(Animation)
    private appearRobotSmoke: Animation;

    @property(Animation)
    private CycleSkip: Animation;

    @property(Animation)
    private SmokeAni: Animation;

    @property({ type: AudioController })
    private audioController: AudioController;

    @property({ type: AudioSource })
    private audioFire: AudioSource;

    @property({ type: AudioSource })
    private audioFireRobot: AudioSource;

    @property({ type: AudioSource })
    private RobotRun: AudioSource;

    @property({ type: AudioSource })
    private audioFireSkip: AudioSource;
    @property({type:Prefab})
    private coinPrefabs:Prefab;

    

    private nextfire: number = 0;
    private nexfireRocket: number = 0;
    private nexfireGlow: number = 0;
    private Bullet: NodeCustom;
    private checkFly: Boolean = false;
    private nextRocket: number = 500;
    private rocket;
    private speed = 10;
    private countHitLand: number = 0;
    private Score: number = 0;
    private countScore: number = 1;
    private checkStart: boolean = false;
    private checkStart1: boolean = false;
    private Speed: number = 3;
    private JacketPos;
    private checkGamepover: boolean = false;
    private ShieldStatus: boolean = false;
    private ShieldFailAni: boolean = false;
    private ScoreStatus: boolean = false;
    private idInterval: number = 0;
    private roll:boolean=false;
    private checkFlyRobot:boolean=false;
    private touchEndCheck:boolean=true  ;
    private checkcOUNTRobot:number=0;
    private safeStatus:boolean=false;
    private checkLive:boolean=false;
    private checkSkip:boolean=false;
    

    protected onLoad(): void {
        // this.gameCenter.startMatch(()=>{
        this.JacketPos = this.gameModel.Jacket.position.clone();
        if (this.OverPandel) {
            this.OverPandel.active = false;
        }
        if (this.Skip) {
            this.Skip.active = false;
        };
        if (!this.title) {
            this.title.active = true;
        }
        if (this.SkipNode) {
            this.SkipNode.active = false;
        }

        if (this.OverLabel) {
            this.OverLabel.active = false;
        }
        const parentNode = this.parentNode;
        const rows = 2;
        const cols = 2;

        this.splitNodeIntoGrid(this.parentNode, 4, 6);
        const onePositions = [
            [0, 0], // O
            [1, 0], // N
            [0, 1], // E
        ];

        const cellWidth = parentNode.getComponent(UITransform).width / cols;
        const cellHeight = parentNode.getComponent(UITransform).height / rows;

        // Create and position prefabs to form the letter "One"
        for (const [col, row] of onePositions) {
            const positionX = col * cellWidth + cellWidth / 2;
            const positionY = row * cellHeight + cellHeight / 2;
            const coinNode = instantiate(this.coinPrefabs);
            coinNode.getComponent(UITransform).width = cellWidth;
            coinNode.getComponent(UITransform).height = cellHeight;
            coinNode.setPosition(new Vec3(positionX, positionY));
            parentNode.addChild(coinNode);
        }
        // input.on(Input.EventType.TOUCH_START,this.touchStart,this);
        // input.on(Input.EventType.TOUCH_END,this.touchEnd,this);
        ObjectPool.Instance.CreateListObject(Constants.bulletPrefab1, this.bullet, 30, this.BulletNode);
        ObjectPool.Instance.CreateListObject(Constants.glowPrefab, this.glow, 3, this.glowNode);
        ObjectPool.Instance.CreateListObject(Constants.glowOffPrefab, this.glowOff, 2, this.glowNode);
        ObjectPool.Instance.CreateListObject(Constants.bulletAnim, this.bulletAnim, 10, this.gameModel.BulletAnim);
        ObjectPool.Instance.CreateListObject(Constants.Rocket, this.gameModel.RocketPrefabs, 2, this.gameModel.RocketNode);
        this.contactChar();
        this.contactBird();
        if (this.checkPoint2.active === true) {
            this.checkPoint2.active = false;
        }
        this.checkStart1 = true
        // });
    }
   



    private contactBird(): void {
        const playerCollider = this.land.getComponent(Collider2D);
        if (playerCollider) {
            playerCollider.on(Contact2DType.BEGIN_CONTACT, this.onPlayerContact, this);
        }
    }

    private contactChar(): void {
        const playerCollider = this.gameModel.Character.getComponent(Collider2D);
        if (playerCollider) {
            playerCollider.on(Contact2DType.BEGIN_CONTACT, this.charcontact, this);
        }
    }

    protected update(deltaTime: number): void {
        if (this.checkStart && this.checkStart1) {
            this.LightAni.node.position=this.gameModel.Character.position;
            if(this.checkFlyRobot===true&&this.Skill.active===true)
            {
                this.RobotRun.stop();
            }

            if(this.roll===false)
            {
                this.scheduleOnce(() => {
                    this.randomrocket(randomRangeInt(1,3))
                }, 5);
                this.roll=true;
            }
           
            this.gameModel.Background.position = new Vec3(this.gameModel.Background.position.x - this.speed, this.gameModel.Background.position.y);
            setTimeout(() => {
                this.ScoreStatus = true;
            }, 5000);
            if (this.ScoreStatus === true) {
                this.Score += this.countScore;
            }
            if (this.gameModel.WarningNode) {
                this.gameModel.WarningNode.position = new Vec3(this.gameModel.WarningNode.position.x, this.gameModel.Character.position.y);
            }
           
            if (this.checkFly&&this.Skill.active===false) {
                this.gameModel.Character.getComponent(RigidBody2D).applyForce(new Vec2(0, 70), new Vec2(0, 0), true);
                this.Bullet = ObjectPool.Instance.getObject(Constants.bulletPrefab1, this.BulletNode);
                if (Date.now() > this.nextfire) {
                    this.nextfire = Date.now() + this.firerate
                    this.Bullet.GetNode().active = true;
                    this.Bullet.GetNode().position = new Vec3(this.gameModel.Jacket.position.x, this.gameModel.Character.position.y);
                    let rotationRandom: number[] = [-80, -90, -100];
                    let randomPrefabIndex = Math.floor(Math.random() * rotationRandom.length);
                    let randomRotation = rotationRandom[randomPrefabIndex];
                    const power = 40;
                    const velocityX = power * Math.cos(this.degreesToRadians(randomRotation));
                    const velocityY = power * Math.sin(this.degreesToRadians(randomRotation));
                    this.Bullet.GetNode().getComponent(RigidBody2D).linearVelocity = new Vec2(velocityX, velocityY);
                }
            }
            let numEnemies = 20;
            let enemyPrefabs: string[] = [Constants.glowPrefab, Constants.glowOffPrefab];
            for (let i = 0; i < numEnemies; i++) {
                let randomPrefabIndex = Math.floor((Math.random() * enemyPrefabs.length));
                let randomPrefabName = enemyPrefabs[randomPrefabIndex];
                let Enemy: NodeCustom = ObjectPool.Instance.getObject(randomPrefabName, this.glowNode, true);
                Enemy && (Enemy.GetNode().active = true);
                let spacing = math.randomRange(200, 1500);
                let RotationRandom = math.randomRange(0, 360);
                Enemy && (Enemy.GetNode().position = new Vec3(i * spacing, 0, 0));
                Enemy && (Enemy.GetNode().setRotationFromEuler(0, 0, RotationRandom));
            }
            let usedPositions = [];
            for (let i = 0; i < this.glowNode.children.length; i++) {
                const childNode = this.glowNode.children[i];
               this.scheduleOnce(() => {
                    const newX = childNode.position.x - this.speed;
                    if (newX < -2000) {
                        let randomValueX;
                        let randomValueY;
                        do {
                            randomValueX = Math.floor(Math.random() * 5) + 1;
                            randomValueY = Math.floor(math.randomRangeInt(10, 90));
                        } while (usedPositions.some(pos => {
                            const distance = Math.abs(randomValueX * 1000 - pos.x);
                            return distance < 1000;
                        }));

                        usedPositions.push({ x: randomValueX * 1000, y: randomValueY });
                        childNode.position = new Vec3(randomValueX * 1000, randomValueY);
                    } else {
                        childNode.position = new Vec3(newX, childNode.position.y, childNode.position.z);
                    }
                }, 5);
            }
            for (let i = 0; i < this.gameModel.RocketNode.children.length; i++) {
                const childNode = this.gameModel.RocketNode.children[i];
                if (this.checkGamepover === false) {
                    if (childNode.position.x <= -1000) {
                        childNode.active = false
                        this.gameModel.WarningNode.position = new Vec3(this.gameModel.WarningNode.position.x, this.gameModel.Character.position.y);
                    }
                }
            }
        }

        this.ScoreCur.string = `${this.Score}M`;
        this.ScoreEnd.string = `${this.Score}M`;
        this.gameModel.BestScore.string = `${Constants.dataUser.highScore}M`;    
    }


  
    private randomrocket(t: number)
    {
        this.gameModel.WarningNode.active = true;
        this.audioController.onAudio(15);
        this.gameModel.WarningNode.getComponent(Animation).play('WarningB')
        this.gameModel.WarningNode.getComponent(Animation).on(Animation.EventType.FINISHED, () =>
            this.replayRocket()     
        );
        if(this.checkGamepover)
        {
            return;
        }
        this.scheduleOnce(()=>{
            this.randomrocket(Math.floor(math.randomRangeInt(3, 10)));
        },t)
    }

    private onPlayerContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        if(otherCollider.tag === 3&&this.Skill.active===true)
        {
            if(this.checkFlyRobot===true)
            {
                input.on(Input.EventType.TOUCH_START, this.touchStart, this);
            }
            this.checkcOUNTRobot=0
            this.Skill.getComponent(Animation).play('DownNotFire');
            this.audioController.onAudio(8);
            this.SmokeRobot.play('SmokeDown');
            this.gameModel.Character.getComponent(RigidBody2D).linearVelocity=new Vec2(0,0);
            this.Skill.getComponent(Animation).on(Animation.EventType.FINISHED, () =>
            this.Skill.getComponent(Animation).play('Run'),
            this.RobotRun.play()
            )
            this.checkFlyRobot=false;
            this.FireRobot.active=false;
            this.gameModel.Character.getComponent(RigidBody2D).gravityScale=2;
        }
        if (otherCollider.tag === 1) {
            otherCollider.node.active = false;
            let bulletAnim: NodeCustom = ObjectPool.Instance.getObject(Constants.bulletAnim, this.gameModel.BulletAnim);
            bulletAnim.GetNode().active = true;
            bulletAnim.GetNode().position = new Vec3(otherCollider.node.position.x, otherCollider.node.position.y);
            bulletAnim.GetNode().getComponent(Animation).play();
            bulletAnim.GetNode().getComponent(Animation).on(Animation.EventType.FINISHED, () => bulletAnim.GetNode().active = false);
        }
        if (otherCollider.tag === 3 && this.countHitLand === 0&&this.Skill.active===false) {
            this.gameModel.CharacterAniBody.play('BodyRun');
            this.gameModel.CharacterAniHead.play('HeadDown');
            this.gameModel.CharacterAniHead.on(Animation.EventType.FINISHED, () => {
                if (this.countHitLand !== 0) {
                    return;
                }
                if (this.speed !== 0) {
                    this.gameModel.CharacterAniHead.play('Headrun');
                }
            });
        }

        if (otherCollider.tag === 5) {
            if (this.checkPoint2.active === false) {
                this.checkPoint2.active = true;
            }
            this.background1.setPosition(this.background1.position.x + 22093.152, this.background1.position.y);
        }
        if (otherCollider.tag === 6) {
            this.background2.setPosition(this.background2.position.x + 22093.152, this.background2.position.y);
        }
    }

    private replayRocket():void{
        this.gameModel.WarningNode.active = false;
        let rocket= ObjectPool.Instance.getObject(Constants.Rocket, this.gameModel.RocketNode, true);
        if(rocket){
            rocket.node.position=new Vec3(0,this.gameModel.WarningNode.position.y);
            rocket.node.active=true;
            this.audioController.onAudio(14)
        }
    }

    private async charcontact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): Promise<void> {
        if(this.safeStatus===false)
        {
        if (otherCollider.tag === 8 && this.ShieldStatus === true || otherCollider.tag === 7 && this.ShieldStatus === true) {
            if (this.ShieldFailAni === false) {
                this.audioController.onAudio(13);
                this.gameModel.Shield.play('ShiedFail');
                setTimeout(() => {
                    this.ShieldStatus = false;
                }, 2000);
                this.ShieldFailAni = true;
            }

            
        }else if(otherCollider.tag === 8 && this.Skill.active===true || otherCollider.tag === 7 && this.Skill.active === true){
            this.Skill.active=false;
            this.appearRobotSmoke.play();
            this.audioController.onAudio(9);
            this.safeStatus=true;
            if(this.GrayAsset.active===false)
            {
                this.GrayAsset.active=true;
                this.GrayAssetChild.getComponent(Animation).play();
                this.GrayAssetChild.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
                    this.GrayAsset.active=false;
                    this.safeStatus=false;
                });
            }
            this.appearRobotSmoke.on(Animation.EventType.FINISHED, () => {
                this.appearRobotSmoke.node.active=false;
            });
            input.on(Input.EventType.TOUCH_START, this.touchStart, this);
        }
         else {
            if (otherCollider.tag === 7 && this.ShieldStatus === false) {
                this.countHitLand++;
                if(this.countHitLand===1)
                {
                    this.gameModel.Character.getComponent(RigidBody2D).enabled=false;
                    this.checkGamepover = true;
                    this.touchEnd();
                    input.off(Input.EventType.TOUCH_START, this.touchStart, this);
                    this.Camera2d.off(Input.EventType.TOUCH_CANCEL, this.touchEnd, this);
                    input.off(Input.EventType.TOUCH_END, this.touchEnd, this);
                    this.gameModel.CharacterAniHead.play('DieHead');
                    this.gameModel.CharacterAniBody.play('DieBody');
                    this.gameModel.Character.getComponent(Animation).play('DieRotation')
                    this.gameModel.CharacterAniJacket.node.active = false;
                    for (let i = 10; i >= 0; i -= 2) {
                        this.speed = i;
                        await this.delay(300);
                    }
                    this.OverLabel.active=true;
                    this.Clock.play();
                    this.Clock.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
                        if(this.checkLive===false){
                            this.OverLabel.active=false;
                            this.countScore = 0
                            this.OverPandel.active = true;
                            this.gameCenter.completeMatch(() => {}, {
                                score: Math.floor(this.Score),
                            });
                            this.saveBestScore();
                        }
                    });
                }
                this.checkGamepover = true
                if (this.countHitLand === 2) {
                    this.gameModel.Character.getComponent(RigidBody2D).enabled=false;
                    this.touchEnd();
                    this.safeStatus=true;
                    input.off(Input.EventType.TOUCH_START, this.touchStart, this);
                    this.Camera2d.off(Input.EventType.TOUCH_CANCEL, this.touchEnd, this);
                    input.off(Input.EventType.TOUCH_END, this.touchEnd, this);
                    this.gameModel.CharacterAniHead.play('DieHead');
                    this.gameModel.CharacterAniBody.play('DieBody');
                    this.gameModel.Character.getComponent(Animation).play('DieRotation')
                    this.gameModel.CharacterAniJacket.node.active = false;
                    this.countScore = 0;
                    for (let i = 10; i >= 0; i -= 2) {
                        this.speed = i;
                        await this.delay(300);
                    }
                    this.OverPandel.active = true;
                }
                this.gameCenter.completeMatch(() => {}, {
                    score: Math.floor(this.Score),
                });

                this.saveBestScore();
            }
            if (otherCollider.tag === 8 && this.ShieldStatus === false) {
                this.gameModel.Character.getComponent(RigidBody2D).enabled=false;
                this.rocket.active=false;
                this.checkGamepover = true;
                this.audioController.onAudio(5)
                this.touchEnd();
                this.safeStatus=true;
                input.off(Input.EventType.TOUCH_START, this.touchStart, this);
                input.off(Input.EventType.TOUCH_END, this.touchEnd, this);
                this.gameModel.CharacterAniHead.play('HeadFire');
                this.gameModel.CharacterAniBody.play('BodyFire');
                this.gameModel.CharacterAniJacket.node.active = false;
                this.countScore = 0;
                this.gameModel.RocketNode.active = false;
                this.Head.position = new Vec3(this.Head.position.x, this.Head.position.y - 8);
                for (let i = 10; i >= 0; i -= 2) {
                    if (i === 0) {
                        this.Head.position = new Vec3(this.Head.position.x, this.Head.position.y + 8)
                        this.gameModel.CharacterAniHead.play('DieHead');
                        this.gameModel.CharacterAniBody.play('DieBody');
                        this.gameModel.Character.getComponent(Animation).play('DieRotation')
                    }
                    this.speed = i;
                    await this.delay(300);
                }
                this.OverPandel.active = true;
                this.gameCenter.completeMatch(() => {}, {
                    score: Math.floor(this.Score),
                });

                this.saveBestScore();
            }
        }
    }
    }

    private delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private degreesToRadians(degress: number): number {
        return degress * (Math.PI / 180);
    }

    private touchStart(): void {
        if(this.checkSkip===true)
        {
            return;
        }
        this.checkFly = true;
        if(this.Skill.active===false)
        {
            this.characterAniFly();
        }

        if(this.Skill.active===false)
        {
            this.audioFire.play();
        }
        if(this.Skill.active===true&&this.checkFlyRobot===false)
        {
            this.Skill.getComponent(Animation).play('Fly');
            this.audioController.onAudio(6);
            this.Skill.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            });
            this.SmokeRobot.play('SmokeFly');
                this.Skill.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
                    if(this.checkFlyRobot&&this.checkFly===true){
                            this.Skill.getComponent(Animation).play('FireRobot');
                            this.FireRobot.active=true;
                            this.audioFireRobot.play();
                            this.gameModel.Character.getComponent(RigidBody2D).gravityScale=0.2;
                    }
                });
        }
        if(this.Skill.active===true&&this.checkFlyRobot===false)
        {
            this.gameModel.Character.getComponent(RigidBody2D).applyForce(new Vec2(0, 1200), new Vec2(0, 0), true);
            this.checkFlyRobot=true
            input.off(Input.EventType.TOUCH_START, this.touchStart, this);
        }
        
    }

    private touchEnd(): void {
        if(this.checkSkip===true)
        {
            return;
        }
        this.gameModel.Character.getComponent(RigidBody2D).gravityScale=2;
        this.checkFly = false;
        this.gameModel.CharacterAniBody.play('Down');
        this.audioFire.stop();
        this.audioController.onAudio(1)
        this.characterAniRun();
        if(this.Skill)
        {
            this.FireRobot.active=false;
            this.audioFireRobot.stop();
        }
       
        this.checkcOUNTRobot++
        if(this.Skill&&this.checkcOUNTRobot===1)
        {
            this.Skill.getComponent(Animation).play('OnAir');
            this.Skill.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
                if(this.checkFlyRobot===true)
                {
                    this.Skill.getComponent(Animation).stop();
                }
            });
        }
    }


    private touchCancel(): void {
        this.gameModel.Character.getComponent(RigidBody2D).gravityScale=2;
        this.checkFly = false;
        this.gameModel.CharacterAniBody.play('Down');
        this.audioFire.stop();
        this.audioController.onAudio(1)
        this.characterAniRun();
        if(this.Skill)
        {
            this.FireRobot.active=false;
            this.audioFireRobot.stop();
        }
       
        this.checkcOUNTRobot++
        if(this.Skill&&this.checkcOUNTRobot===1)
        {
            this.Skill.getComponent(Animation).play('OnAir');
            this.Skill.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
                if(this.checkFlyRobot===true)
                {
                    this.Skill.getComponent(Animation).stop();
                }
            });
        }
    }

    private characterAniRun(): void {
        this.gameModel.CharacterAniJacket.play('Jacket');
        this.gameModel.BulletFlash.node.active = false;
        let Bullet: NodeCustom = ObjectPool.Instance.getObject('bullet', this.BulletNode);
        Bullet.node.active = false;
    }

    private characterAniFly(): void {
        this.gameModel.BulletFlash.play();
        this.gameModel.CharacterAniHead.play('Head');
        this.gameModel.CharacterAniBody.play('Body');
        this.gameModel.CharacterAniJacket.crossFade('JacketFire', 1000);
        this.gameModel.BulletFlash.node.active = true;
        this.BulletNode.active = true;
    }

    private splitNodeIntoGrid(parentNode: Node, rows: number, cols: number) {
        
        const parentWidth = parentNode.getComponent(UITransform).width;
        const parentHeight = parentNode.getComponent(UITransform).height;
        const cellWidth = parentWidth / cols;
        const cellHeight = parentHeight / rows;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const childNode = instantiate(this.coinPrefabs);
                childNode.getComponent(UITransform).width = cellWidth;
                childNode.getComponent(UITransform).height = cellHeight;
                childNode.setPosition(new Vec3(0 * cellWidth + cellWidth / 2, 1 * cellHeight + cellHeight / 2));
                parentNode.addChild(childNode);
            }
        }
    }


    private skipRed(): void {
        this.checkSkip=true;
        this.audioController.onAudio(16)
        this.CycleSkip.play();
        this.safeStatus=true;
        this.ScoreStatus = true;
        this.SkipNode.active = false;
        this.charRigi.enabled = false;
        this.CycleSkip.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            this.redSetting();
        });
        // this.CameraUi.getComponent(Animation).play();
        // this.CameraRender.getComponent(Animation).play()
        // this.ScoreStatus = true;
        // this.SkipNode.active = false;
        // if (this.Skip.active === false) {
        //     this.Skip.active = true;
        // }
        // this.Head.position = new Vec3(this.Head.position.x + 13)
        // this.gameModel.CharacterAniBody.play('SkipBody');
        // this.gameModel.CharacterAniJacket.play('SkipJacket');
        // this.gameModel.SkipBody.play('HeadViolet');
        // this.gameModel.SkipHead.play('HeadBody');
        // // this.gameModel.SkipTail.play('Tailred');
        // this.speed = 100;
        // this.countScore = 3;
        // this.charRigi.enabled = false;
        // input.off(Input.EventType.TOUCH_START, this.touchStart, this);
        // input.off(Input.EventType.TOUCH_END, this.touchEnd, this);
        // setTimeout(() => {
        //     this.CameraUi.getComponent(Animation).stop();
        //     this.CameraRender.getComponent(Animation).stop();
        //     input.on(Input.EventType.TOUCH_START, this.touchStart, this);
        //     input.on(Input.EventType.TOUCH_END, this.touchEnd, this);
        //     input.on(Input.EventType.TOUCH_CANCEL, this.touchCancel, this);
        //     this.gameModel.Jacket.position = this.JacketPos;
        //     this.charRigi.enabled = true;
        //     this.Head.position = new Vec3(this.Head.position.x - 13)
        //     this.speed = 10;
        //     this.gameModel.CharacterAniBody.play('BodyRun');
        //     this.gameModel.CharacterAniHead.play('Headrun');
        //     this.gameModel.CharacterAniJacket.play('Jacket');
        //     this.gameModel.CharacterAniJacket.node.rotation = new Quat(0, 0, 0);
        //     this.gameModel.CharacterAniBody.node.rotation = new Quat(0, 0, 0);
        //     this.Skip.active = false;
        //     this.countScore = 1;
        // }, 5000);
    }

    private skipBlue(): void {
        this.checkSkip=true;
        this.audioController.onAudio(16)
        this.CycleSkip.play();
        this.safeStatus=true;
        this.ScoreStatus = true;
        this.SkipNode.active = false;
        this.charRigi.enabled = false;
        this.CycleSkip.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            this.blueSetting();
        });
    }

    private startNode(): void {
        this.SmokeAni.node.active=true;
        this.SmokeAni.play();
        this.audioController.onAudio(20);
        this.Door.active=true;
        this.gameModel.Character.getComponent(Animation).play('MoveStart');
        this.gameModel.Character.getComponent(Animation).on(Animation.EventType.FINISHED, () => {
            this.checkStart = true;
        });
        this.SettingIcon.active = false;
        this.title.active = false;
        this.Camera2d.on(Input.EventType.TOUCH_START, this.touchStart, this);
        this.Camera2d.on(Input.EventType.TOUCH_END, this.touchEnd, this);
        this.Camera2d.on(Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        setTimeout(() => {
            this.SkipNode.active = true
        }, 1000);

        setTimeout(() => {
            this.SkipNode.active = false
        }, 5000);
    }

    private replay(): void {
        director.loadScene("Game")
    }

    private Exit(): void {
        this.Setting.active = false
    }

    private SettingPan(): void {
        this.Setting.active = true;
    }

    private Shield(): void {
        this.gameModel.Shield.play('Shield');
        this.audioController.onAudio(12);
        this.SkipNode.active = false;
        this.ShieldStatus = true;
    }

    private Booster(): void {
        this.Skill.active=true;
        this.SkipNode.active = false;
        this.audioController.onAudio(10);
        if(this.appear.node.active===false)
        {
            this.appearRobotSmoke.node.active=true;
            this.appear.node.active=true;
            this.appearLabel.play();
            this.appearObject.play();
            this.appearRobotSmoke.play();
            this.Skill.getComponent(Animation).play('Run')
            this.RobotRun.play();
            this.appearObject.on(Animation.EventType.FINISHED, () => {
               this.appear.play();
            });
        }
    }


    private Heal():void
    {
        this.gameModel.Character.getComponent(RigidBody2D).enabled=true;
        this.audioController.onAudio(18)
        this.checkLive=true;
        this.OverLabel.active=false;
        this.LightAni.play();
        tween(this.gameModel.Character)
        .to(3, {rotation: new Quat(0,0)})
        .call(() => { 
            this.gameModel.Shield.play('HealEffect')
            this.gameModel.Shield.on(Animation.EventType.FINISHED, () => {
                this.resetStatus();
             });
        })
        .start()
    }


    private saveBestScore(): void {
        Constants.dataUser.highScore = Constants.dataUser.highScore < this.Score ? this.Score : Constants.dataUser.highScore;
    }

    private resetStatus():void
    {
        this.countScore=1;
        input.on(Input.EventType.TOUCH_START, this.touchStart, this);
        this.Camera2d.on(Input.EventType.TOUCH_CANCEL, this.touchEnd, this);
        input.on(Input.EventType.TOUCH_END, this.touchEnd, this);
        this.gameModel.CharacterAniHead.node.setRotation(new Quat(0,0));
        this.gameModel.CharacterAniBody.node.setRotation(new Quat(0,0));
        this.gameModel.CharacterAniHead.play('Headrun');
        this.gameModel.CharacterAniBody.play('BodyRun');
        this.gameModel.CharacterAniJacket.node.active = true;
        this.speed=10;
        this.LightAni.node.active=false;
    }


    private blueSetting():void
    {
        this.audioController.onAudio(17);
        this.audioFireSkip.play();
        this.CameraUi.getComponent(Animation).play();
        this.CameraRender.getComponent(Animation).play();
        this.safeStatus=true;
        this.ScoreStatus = true;
        this.SkipNode.active = false;
        if (this.Skip.active === false) {
            this.Skip.active = true;
        }
        // input.off(Input.EventType.TOUCH_START, this.touchStart, this);
        // input.off(Input.EventType.TOUCH_END, this.touchEnd, this);
        // input.on(Input.EventType.TOUCH_CANCEL, this.touchCancel, this);
        this.Head.position = new Vec3(this.Head.position.x + 13)
        this.gameModel.CharacterAniBody.play('SkipBody');
        this.gameModel.CharacterAniJacket.play('SkipJacket');
        this.gameModel.SkipBody.play('BodyBlue');
        this.gameModel.SkipHead.play('HeadBlue');
        // this.gameModel.SkipTail.play('SkipBlueTail');
        this.speed = 60;
        this.countScore = 2;
        this.charRigi.enabled = false;
        setTimeout(() => {
            this.audioFireSkip.stop();
            this.audioController.onAudio(19)
            this.CameraUi.getComponent(Animation).stop();
            this.CameraRender.getComponent(Animation).stop();
            this.Camera2d.on(Input.EventType.TOUCH_START, this.touchStart, this);
            this.Camera2d.on(Input.EventType.TOUCH_END, this.touchEnd, this);
            this.Camera2d.on(Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
            this.gameModel.Jacket.position = this.JacketPos;
            this.Head.position = new Vec3(this.Head.position.x - 13)
            this.charRigi.enabled = true;
            this.speed = 10;
            this.gameModel.CharacterAniBody.play('BodyRun');
            this.gameModel.CharacterAniHead.play('Headrun');
            this.gameModel.CharacterAniJacket.play('Jacket');
            this.gameModel.CharacterAniJacket.node.rotation = new Quat(0, 0, 0);
            this.gameModel.CharacterAniBody.node.rotation = new Quat(0, 0, 0);
            this.Skip.active = false;
            this.countScore = 1;
            this.checkSkip=false;
        }, 5000);
        setTimeout(() => {
            this.safeStatus=false;
        }, 8000);
    }

    private redSetting():void
    {
        this.audioController.onAudio(17);
        this.audioFireSkip.play();
        this.CameraUi.getComponent(Animation).play();
        this.CameraRender.getComponent(Animation).play()
        this.ScoreStatus = true;
        this.SkipNode.active = false;
        if (this.Skip.active === false) {
            this.Skip.active = true;
        }
        this.Head.position = new Vec3(this.Head.position.x + 13)
        this.gameModel.CharacterAniBody.play('SkipBody');
        this.gameModel.CharacterAniJacket.play('SkipJacket');
        this.gameModel.SkipBody.play('HeadViolet');
        this.gameModel.SkipHead.play('HeadBody');
        // this.gameModel.SkipTail.play('Tailred');
        this.speed = 100;
        this.countScore = 3;
        this.charRigi.enabled = false;
        input.off(Input.EventType.TOUCH_START, this.touchStart, this);
        input.off(Input.EventType.TOUCH_END, this.touchEnd, this);
        setTimeout(() => {
            this.audioFireSkip.stop();
            this.audioController.onAudio(19)
            this.CameraUi.getComponent(Animation).stop();
            this.CameraRender.getComponent(Animation).stop();
            input.on(Input.EventType.TOUCH_START, this.touchStart, this);
            input.on(Input.EventType.TOUCH_END, this.touchEnd, this);
            input.on(Input.EventType.TOUCH_CANCEL, this.touchCancel, this);
            this.gameModel.Jacket.position = this.JacketPos;
            this.charRigi.enabled = true;
            this.Head.position = new Vec3(this.Head.position.x - 13)
            this.speed = 10;
            this.gameModel.CharacterAniBody.play('BodyRun');
            this.gameModel.CharacterAniHead.play('Headrun');
            this.gameModel.CharacterAniJacket.play('Jacket');
            this.gameModel.CharacterAniJacket.node.rotation = new Quat(0, 0, 0);
            this.gameModel.CharacterAniBody.node.rotation = new Quat(0, 0, 0);
            this.Skip.active = false;
            this.countScore = 1;
            this.checkSkip=false;
        }, 5000);

        setTimeout(() => {
            this.safeStatus=false;
        }, 8000);
    }
}

