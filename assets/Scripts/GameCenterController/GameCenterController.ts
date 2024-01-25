import { _decorator, Component, director, find, Game, Node } from 'cc';
import { StoreAPI } from '../StoreAPI';
import { Constants } from '../Data/Constants';
import GameClient from '@onechaintech/gamesdk-dev';


const { ccclass, property } = _decorator;

@ccclass('GameCenterController')
export class GameCenterController extends Component {
    private readonly gameIDDev: string = '64ec6fc0af99693c5b2df8b4';
    private readonly apiKeyDev: string = '93850d91-4878-46f3-b264-d156f91de329';
    public gameClient;

    public async initGameClient(callBack: () => void): Promise<void> {
        let parameters = find(Constants.NODE_NAME.GameClient);

        if (!parameters) {
            parameters = new Node(Constants.NODE_NAME.GameClient);

            if (!this.gameClient) {
                this.gameClient = new GameClient(this.gameIDDev, this.apiKeyDev, window.parent, { dev: true });
                this.gameClient.initAsync().then(async () => {
                    //Get current user id
                    let userID = this.gameClient.user.citizen.getCitizenId();

                    //Get gamedata from server
                    await this.gameClient.user.data.getGameData().then((response) => {
                        //Save data
                        if (response.data[`${userID}`] !== undefined) Constants.dataUser = response.data[`${userID}`];
                        // console.log(Constants.dataUser );

                    }).catch(async (e) => {
                        console.log('Error at get game data: ', e);
                    })

                    let gameClientParams = parameters.addComponent(StoreAPI);
                    gameClientParams.gameClient = this.gameClient;
                    director.addPersistRootNode(parameters);

                    //Run callback
                    callBack.apply(callBack);
                }).catch((e) => {
                    console.log('Error at init game client: ', e);
                })
            }
        }
    }

    public startMatch(callBack: () => void): void {
        let parameters = find(Constants.NODE_NAME.GameClient);
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;

        gameClientParams.gameClient.match.startMatch().then((data) => {
            gameClientParams.matchData = data;

            //Create array log
            if (!Constants.dataUser.checkLog) Constants.dataUser.checkLog = {};
            Constants.dataUser.checkLog[data.matchId] = [];

            // Apply callback
            callBack.apply(callBack);
        }).catch((error) => console.log('Error at start match: ', error));
    }

    /**
     * Set log game data
     * @param logGame Log of game
     */
    public setGameData(logGame: { score: number, seconds: number, datetime: string }): void {
        let parameters = find(Constants.NODE_NAME.GameClient);
        let gameClientParams = parameters.getComponent(StoreAPI);

        this.gameClient = gameClientParams.gameClient;
        let userID = this.gameClient.user.citizen.getCitizenId();
        let matchId = gameClientParams.matchData.matchId

        Constants.dataUser.checkLog[`${matchId}`].push(logGame);
    }

    /**
     * 
     * @param callBack Call when api done
     * @param data Data leader board
     */
    public completeMatch(callBack: () => void, data: Object): void {
        let parameters = find(Constants.NODE_NAME.GameClient);
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        let _gameClient = this.gameClient;

         this.gameClient.match.completeMatch(gameClientParams.matchData, data)
            .then(async () => {
                let userID = _gameClient.user.citizen.getCitizenId();

                _gameClient.user.data.setGameData({ [userID]: Constants.dataUser }, false).then(() => { })
                    .catch((e) => { console.log("Error at set game data", e); })

                //Apply callback
                callBack.apply(callBack);
            }).catch((e) => {
                console.log(e);
            })
    }

    public logMatch(data: Object): void {
        let parameters = find(Constants.NODE_NAME.GameClient);
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        this.gameClient.match.logMatch(gameClientParams.matchData.matchId, data).catch((e) => console.log(e));
    }
}