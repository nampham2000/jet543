import { _decorator, Component, Node, RigidBody2D, Collider2D, UITransform, Vec2, Size, tween, Vec3, Tween, Animation } from 'cc';
// import { AudioController } from './AudioController';
const { ccclass, property } = _decorator;

@ccclass('NodeCustom')
export class NodeCustom extends Component {

    private uiTransform: UITransform;
    private col: Collider2D;
    private rb: RigidBody2D;
    private anim: Animation
    thrustForce: number = 100; // Độ lớn của lực đẩy


    onLoad(): void {
        this.uiTransform = this.getComponent(UITransform);
        this.col = this.getComponent(Collider2D);
        this.rb = this.getComponent(RigidBody2D);
        this.anim = this.getComponent(Animation);
        
    }
    public GetNode(): Node {
        return this.node;
    }
    public GetCol(): Collider2D {
        return this.col;
    }
    public MovingStraight(dict: Vec2) {
        if (this.rb != null) {
            this.rb.linearVelocity = dict;
        }
        this.DisableNodeInTime(5);

    }




    public falling(force: number) {
        this.rb.linearVelocity = new Vec2(0, -force)
    }


    public DisableNodeInTime(time: number) {
        this.scheduleOnce(this.DisableNode, time);
    }
    private DisableNode() {
        if (this.node)
            this.node.active = false;
    }
    public PlayAnim() {
        if (this.anim) {
            this.anim.play();
        }
    }

}


