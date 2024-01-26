import { _decorator, Component, director, find, Node } from 'cc';
import { Constants } from '../Data/Constants';
const { ccclass, property } = _decorator;
import { GameCenterController } from '../GameCenterController/GameCenterController';

@ccclass('LoadingController')
export class LoadingController extends Component {
    @property(GameCenterController)
    private gameCenter: GameCenterController;

    public async start() : Promise<void> {
        this.gameCenter.initGameClient(()=>{
            director.loadScene(Constants.sceneEntry);
        })
    }
}




