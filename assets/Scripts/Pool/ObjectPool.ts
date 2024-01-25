import { _decorator, Component, Node, Prefab, instantiate, game, director } from 'cc';
import { NodeCustom } from './NodeCustom';
const { ccclass, property } = _decorator;

@ccclass('ObjectPool')
export class ObjectPool extends Component {
    private static instance: ObjectPool = null;
    private index = 0;
    private dictQueue: { [key: string]: NodeCustom[] } = {};

    public static get Instance(): ObjectPool {
        if (this.instance === null) {
            this.instance = new ObjectPool;
        }
        return this.instance;
    }

    onLoad() {
        if (ObjectPool.instance !== null && ObjectPool.instance !== this) {
            this.node.destroy();
            return;
        } else {
            ObjectPool.instance = this;
        }

        director.addPersistRootNode(this.node);
    }
    public CreateListObject(name: string, prefab: Prefab, n: number, parent: Node) {
        const queueObject: NodeCustom[] = [];

        for (let i = 0; i < n; i++) {
            const obj = instantiate(prefab);
            let objCustom = obj.addComponent(NodeCustom);
            obj.setParent(parent);
            objCustom.GetNode().name = obj.name + "_" + this.index;
            objCustom.GetNode().active = false;
            this.index++;


            queueObject.push(objCustom);
        }
        this.dictQueue[name] = queueObject;
    }

    public getObject(name: string, parent: Node = null, isQuantityLimit: Boolean = false): NodeCustom {
        let objCustom: NodeCustom;
        const count = this.dictQueue[name].length;
        for (let i = 0; i < count; i++) {
            objCustom = this.dictQueue[name].shift();
            if (!objCustom.GetNode().active) {
                this.dictQueue[name].push(objCustom);
                if (parent != null) {
                    objCustom.GetNode().setParent(parent);
                }
                return objCustom;

            }
            this.dictQueue[name].push(objCustom);
        }
        if (isQuantityLimit) {
            return null;
        }
        
        let obj = instantiate(this.dictQueue[name][0].GetNode());
        objCustom = obj.getComponent(NodeCustom);
        if (parent != null) {
            objCustom.GetNode().setParent(parent);
        }
        objCustom.GetNode().active = false;
        this.dictQueue[name].push(objCustom);
        return objCustom;
    }
}


