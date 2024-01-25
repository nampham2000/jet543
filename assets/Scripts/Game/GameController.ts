import { _decorator, CCInteger, Collider2D, Component, Contact2DType, Input, input, IPhysics2DContact, math, Node, Prefab, Quat, RigidBody2D, Vec2, Vec3,Animation, cclegacy, log, director, tiledLayerAssembler, BoxCollider2D, tween, instantiate } from 'cc';
import { GameModel } from './GameModel';
import { ObjectPool } from '../Pool/ObjectPool';
import { NodeCustom } from '../Pool/NodeCustom';
import { Constants } from '../Data/Constants';
import { GameCenterController } from '../GameCenterController/GameCenterController';
import { BaseEnemy } from './BaseEnemy';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property({
        type:GameModel,
        tooltip:'GameModel'
    })
    private gameModel:GameModel;
    
    @property({
        type:Prefab,
        tooltip:'Bullet'
    })
    private bullet:Prefab;

    @property({
        type:Prefab,
        tooltip:'Bullet Animation Hit'
    })
    private bulletAnim:Prefab;
    
    @property({
        type:Node,
        tooltip:'Bulllet Node'
    })
    private BulletNode:Node;

    @property({
        type:Prefab,
        tooltip:'Glow Prefab'
    })
    private glow:Prefab;

    @property({
        type:Prefab,
        tooltip:'Glow Off Prefab'
    })
    private glowOff:Prefab;

    @property({
        type:Node,
        tooltip:'Glow Node'
    })
    private glowNode:Node;

    @property({
        type:Node,
        tooltip:'Glow Node'
    })
    private glowOffNode:Node;
    @property({
        type:CCInteger
    })
    private firerate:number=200;

    @property({
        type:Node
    })
    private land:Node;

    @property({
        type:Node
    })
    private background1:Node;

    @property({
        type:Node
    })
    private background2:Node;

    @property({
        type:Node
    })
    private checkPoint2:Node;

    @property({
        type:Node
    })
    private Skip:Node;

    @property({
        type:Node
    })
    private SkipNode:Node;

    @property({
        type:CCInteger
    })
    private firerateRocket:number=3000;

    @property({ 
        type: GameCenterController,
        tooltip:'Game Center'
    })
    private gameCenter: GameCenterController;

    @property({
        type:Node
    })
    private title:Node;

    @property({
        type:Node
    })
    private OverPandel:Node;

    @property({
        type:RigidBody2D
    })
    private charRigi:RigidBody2D;

    @property(Node)
    private Head: Node;


    private nextfire:number=0;
    private nexfireRocket:number=0;
    private nexfireGlow:number=0;
    private Bullet:NodeCustom;
    private checkFly:Boolean=false;
    private nextRocket:number=500;
    private rocket;
    private speed=10;
    private countHitLand:number=0;
    private Score:number=0;
    private countScore:number=1;
    private checkStart:boolean=false;
    private checkStart1:boolean=false;
    private Speed:number=3;
    private maxMonsters: number = 10;
    private monsterCount: number = 0;
    private monsterPrefabsCount: number = 1;
    private jetPos;


    protected onLoad(): void {
        // this.gameCenter.startMatch(()=>{
        if(this.OverPandel)
        {
            this.OverPandel.active=false;
        }
        if(this.Skip)
        {
            this.Skip.active=false;
        };
        if(!this.title)
        {
            this.title.active=true;
        }
        this.SkipNode.active=false;
        setTimeout(() => {
            this.SkipNode.active=true
        }, 1000);

        setTimeout(() => {
            this.SkipNode.active=false
        }, 5000);
        input.on(Input.EventType.TOUCH_START,this.touchStart,this);
        input.on(Input.EventType.TOUCH_END,this.touchEnd,this);
        ObjectPool.Instance.CreateListObject(Constants.bulletPrefab1,this.bullet,30,this.BulletNode);
        ObjectPool.Instance.CreateListObject(Constants.glowPrefab,this.glow,10,this.glowNode);
        ObjectPool.Instance.CreateListObject(Constants.glowOffPrefab,this.glowOff,10,this.glowNode);
        ObjectPool.Instance.CreateListObject(Constants.bulletAnim,this.bulletAnim,10,this.gameModel.BulletAnim);
        ObjectPool.Instance.CreateListObject(Constants.Rocket,this.gameModel.RocketPrefabs,5,this.gameModel.RocketNode);
        this.contactChar();
        this.contactBird();
        if(this.checkPoint2.active===true)
        {
            this.checkPoint2.active=false;
        }
        this.checkStart1=true
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
        
        if(this.checkStart&&this.checkStart1)
        {
            this.gameModel.Background.position = new Vec3(this.gameModel.Background.position.x - this.speed, this.gameModel.Background.position.y);
            this.Score+=this.countScore;
            if(Date.now()>this.nexfireRocket){
                this.nexfireRocket=Date.now()+this.firerateRocket
                this.gameModel.WarningNode.position=new Vec3(this.gameModel.WarningNode.position.x,this.gameModel.Character.position.y);
                this.rocket= ObjectPool.Instance.getObject(Constants.Rocket, this.gameModel.RocketNode,true)
                this.rocket && ( this.rocket.GetNode().active = true);
                this.rocket && (this.rocket.GetNode().position = new Vec3(this.rocket.GetNode().position.x-10,this.gameModel.Character.position.y));
            }
            if (this.checkFly) {
                this.gameModel.Character.getComponent(RigidBody2D).applyForce(new Vec2(0,70),new Vec2(0,0),true);  
                this.Bullet= ObjectPool.Instance.getObject(Constants.bulletPrefab1, this.BulletNode);
                if(Date.now()>this.nextfire){
                    this.nextfire=Date.now()+this.firerate
                    this.Bullet.GetNode().active = true;
                    this.Bullet.GetNode().position = new Vec3(this.gameModel.Jacket.position.x, this.gameModel.Character.position.y);
                    let rotationRandom:number[]=[-80,-90,-100];
                    let randomPrefabIndex =Math.floor(Math.random() * rotationRandom.length); 
                    let randomRotation = rotationRandom[randomPrefabIndex];
                    const power = 40;
                    const velocityX = power * Math.cos(this.degreesToRadians(randomRotation));
                    const velocityY = power * Math.sin(this.degreesToRadians(randomRotation));
                    this.Bullet.GetNode().getComponent(RigidBody2D).linearVelocity = new Vec2(velocityX,velocityY);
                }
        }
        let numEnemies = 20; 
        let enemyPrefabs: string[] = [Constants.glowPrefab, Constants.glowOffPrefab]; 
        for (let i = 0; i < numEnemies; i++) {
            let randomPrefabIndex = Math.floor((Math.random() * enemyPrefabs.length)); 
            let randomPrefabName = enemyPrefabs[randomPrefabIndex];
            let Enemy: NodeCustom = ObjectPool.Instance.getObject(randomPrefabName, this.glowNode,true);
            Enemy && (Enemy.GetNode().active = true);
            let spacing = math.randomRange(200,1500);
            let RotationRandom= math.randomRange(0,360);
            Enemy && (Enemy.GetNode().position = new Vec3(i * spacing, 0, 0));
            Enemy && (Enemy.GetNode().setRotationFromEuler(0, 0, RotationRandom));
            // if(Enemy)
            // {
            //     tween(Enemy.GetNode())
            //     .to((Math.abs(-1500-Enemy.GetNode().position.x)/150), { position: new Vec3(-1500, 0)})
            //     .call(() => { console.log('This is a callback'); })
            //     .start()
            //     console.log(-1500-Enemy.GetNode().position.x);
            // }
            
        }
    }
    }

 

    private onPlayerContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void{
        if(otherCollider.tag===1)
        {
            otherCollider.node.active=false;
            let bulletAnim:NodeCustom = ObjectPool.Instance.getObject(Constants.bulletAnim, this.gameModel.BulletAnim);
            bulletAnim.GetNode().active=true;
            bulletAnim.GetNode().position=new Vec3(otherCollider.node.position.x,otherCollider.node.position.y);
            bulletAnim.GetNode().getComponent(Animation).play();
            bulletAnim.GetNode().getComponent(Animation).on(Animation.EventType.FINISHED,()=> bulletAnim.GetNode().active=false);
        }
        if(otherCollider.tag===3&&this.countHitLand===0)
        {
            this.gameModel.CharacterAniBody.play('BodyRun');
            this.gameModel.CharacterAniHead.play('HeadDown');
            this.gameModel.CharacterAniHead.on(Animation.EventType.FINISHED, () => {
                if (this.countHitLand!==0) {
                    return;
                }
                if(this.speed!==0)
                {
                    this.gameModel.CharacterAniHead.play('Headrun');
                }
            });
        }
        
        if(otherCollider.tag===5)
        {
            if(this.checkPoint2.active===false)
            {

                this.checkPoint2.active=true;
            }
            this.background1.setPosition(this.background1.position.x+22093.152,this.background1.position.y);
        }
        if(otherCollider.tag===6)
        {
            this.background2.setPosition(this.background2.position.x+22093.152,this.background2.position.y);
        }
    }

    private async charcontact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null):Promise<void>{
        if(otherCollider.tag===7)
        {
            this.countHitLand++;
            if(this.countHitLand>0)
            {
                this.touchEnd();
                input.off(Input.EventType.TOUCH_START,this.touchStart,this);
                input.off(Input.EventType.TOUCH_END,this.touchEnd,this);
                this.gameModel.CharacterAniHead.play('DieHead')
                this.gameModel.CharacterAniBody.play('DieBody')
                this.gameModel.CharacterAniJacket.node.active=false;
                this.countScore=0;
                for (let i = 10; i >= 0; i -= 2) {
                    this.speed = i;
                    await this.delay(300);
                }
                this.OverPandel.active=true;
            }
            // this.gameCenter.completeMatch(() => {}, {
            //     score: Math.floor(this.Score),
            // });
        }

        if(otherCollider.tag===8)
        {
            this.touchEnd();
            input.off(Input.EventType.TOUCH_START,this.touchStart,this);
            input.off(Input.EventType.TOUCH_END,this.touchEnd,this);
            // this.Head.position.x
            this.gameModel.CharacterAniHead.play('HeadFire')
            this.gameModel.CharacterAniBody.play('BodyFire')
            this.gameModel.CharacterAniJacket.node.active=false;
            this.countScore=0;
            this.gameModel.RocketNode.active=false
            this.Head.position=new Vec3(this.Head.position.x,this.Head.position.y-8)
            for (let i = 10; i >= 0; i -= 2) {
                if(i===0)
                {
                    this.Head.position=new Vec3(this.Head.position.x,this.Head.position.y+8)
                    this.gameModel.CharacterAniHead.play('DieHead')
                    this.gameModel.CharacterAniBody.play('DieBody')
                }
                this.speed = i;
                await this.delay(300);
            }
            this.OverPandel.active=true;
        }
    }

    private delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private degreesToRadians(degress: number): number {
        return degress * (Math.PI / 180);
    }

    private touchStart(): void
    {
        this.checkFly=true;
        this.characterAniFly();  
        
    }

    private touchEnd(): void
    {
        this.checkFly=false;
        this.gameModel.CharacterAniBody.play('Down');
        this.characterAniRun();
    }

    private characterAniRun(): void
    {
        this.gameModel.CharacterAniJacket.play('Jacket');
        this.gameModel.BulletFlash.node.active=false;
        let Bullet:NodeCustom=ObjectPool.Instance.getObject('bullet',this.BulletNode);
        Bullet.node.active=false;
    }

    private characterAniFly(): void
    {
        this.gameModel.BulletFlash.play();
        this.gameModel.CharacterAniHead.play('Head');
        this.gameModel.CharacterAniBody.play('Body');
        this.gameModel.CharacterAniJacket.crossFade('JacketFire',1000);
        this.gameModel.BulletFlash.node.active=true;
        this.BulletNode.active=true;
    }


    private skipRed():void
    {
        this.SkipNode.active=false;
        if(this.Skip.active===false)
        {
            this.Skip.active=true;
        }
        this.Head.position=new Vec3(this.Head.position.x+13)
        this.gameModel.CharacterAniBody.play('SkipBody');
        this.gameModel.CharacterAniJacket.play('SkipJacket');
        this.gameModel.SkipBody.play('Skipred');
        this.gameModel.SkipHead.play('HeadSkip');
        this.gameModel.SkipTail.play('Tailred');
        this.speed=100;
        this.countScore=3;
        this.charRigi.enabled=false;
        setTimeout(() => {
            this.charRigi.enabled=true;
            this.Head.position=new Vec3(this.Head.position.x-13)
            this.speed=10;
            this.gameModel.CharacterAniBody.play('BodyRun');
            this.gameModel.CharacterAniHead.play('Headrun');
            this.gameModel.CharacterAniJacket.play('Jacket');
            this.gameModel.CharacterAniJacket.node.rotation=new Quat(0,0,0);
            this.gameModel.CharacterAniBody.node.rotation=new Quat(0,0,0);
            this.Skip.active=false;
            this.countScore=1;
        }, 5000);
    }

    private skipBlue():void
    {
        this.SkipNode.active=false;
        if(this.Skip.active===false)
        {
            this.Skip.active=true;
        }
        this.Head.position=new Vec3(this.Head.position.x+13)
        this.gameModel.CharacterAniBody.play('SkipBody');
        this.gameModel.CharacterAniJacket.play('SkipJacket');
        this.gameModel.SkipBody.play('SkipBlueBody');
        this.gameModel.SkipHead.play('SkipBlueHead');
        this.gameModel.SkipTail.play('SkipBlueTail');
        this.speed=60;
        this.countScore=2;
        this.charRigi.enabled=false;
        setTimeout(() => {
            this.Head.position=new Vec3(this.Head.position.x-13)
            this.charRigi.enabled=true;
            this.speed=10;
            this.gameModel.CharacterAniBody.play('BodyRun');
            this.gameModel.CharacterAniHead.play('Headrun');
            this.gameModel.CharacterAniJacket.play('Jacket');
            this.gameModel.CharacterAniJacket.node.rotation=new Quat(0,0,0);
            this.gameModel.CharacterAniBody.node.rotation=new Quat(0,0,0);
            this.Skip.active=false;
            this.countScore=1;
        }, 5000);
    }

    private startNode():void
    {
        this.checkStart=true;
        this.title.active=false;
    }

    private replay():void
    {
        director.loadScene("Game")
    }

    
}

