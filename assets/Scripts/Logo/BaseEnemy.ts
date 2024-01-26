import { _decorator, Collider2D, Component, Node, Prefab, Quat, randomRange, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BaseEnemy')
export class BaseEnemy extends Component {

  protected attackRange: number;
  protected prefabs: Prefab[];
  public startPos: Vec3 = new Vec3(0, 0);
  public hitCounter:number=0

  public move(dt: number, Character: Node, speed: number): void {
    const direction = Character.position.clone().subtract(this.node.position).normalize();
    const moveStep = direction.multiplyScalar(speed * dt);
    this.node.position = this.node.position.add(moveStep);
    this.node.getComponent(Collider2D).apply();





    if (this.node.position.x - Character.position.x >= 0) {
      this.node.scale = new Vec3(-1, 1, 1)
    } else {
      this.node.scale = new Vec3(1, 1, 1)
    }
  }

  // public move(dt: number, Character: Node, speed: number): void {
  //     const direction = Character.position.clone().subtract(this.node.position).normalize();
  //     const moveStep = direction.multiplyScalar(speed * dt);

  //     // Movement
  //     this.node.position = this.node.position.add(moveStep);

  //     // Rotation
  //     const forward = new Vec3(1, 0, 0);  // Assuming initial forward direction is along the x-axis
  //     const rotationQuat = Quat.rotationTo(new Quat(), direction, Vec3.UP);
  //     this.node.setRotation(rotationQuat);

  //     // Apply collider
  //     this.node.getComponent(Collider2D).apply();

  //     // Scale adjustment based on relative positions
  //     if (this.node.position.x - Character.position.x >= 0) {
  //         this.node.scale = new Vec3(-1, 1, 1);
  //     } else {
  //         this.node.scale = new Vec3(1, 1, 1);
  //     }
  // }

  public useSkill(dt: number, Character: Node, clone: Prefab): void {

  }

}
