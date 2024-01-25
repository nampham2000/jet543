import { _decorator, Collider2D, Component, Node, Prefab, Quat, randomRange, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseEnemy')
export class BaseEnemy extends Component {

  protected attackRange: number;
  protected prefabs: Prefab[];
  public startPos: Vec3 = new Vec3(0, 0);
  public hitCounter:number=0

  public move(dt: number,  speed: number): void {
    this.node.position = this.node.position.subtract(new Vec3(-20,0));
    this.node.getComponent(Collider2D).apply();
  }
}