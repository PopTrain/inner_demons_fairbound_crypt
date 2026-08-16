import { StateManager } from './state-manager';
import { AudioManager } from './audio-manager';
import { PlayerData } from './player-data';
import { NetworkService } from './network-service';
import { InputManager } from './input-manager';
import { type GameContext } from './game-context';

export class GameEngine {
    private lastTime: number = 0;
    private stateManager: StateManager;
    private audioManager: AudioManager;
    private playerData: PlayerData;
    private networkService: NetworkService;
    private inputManager: InputManager;
    private gameContext: GameContext;
    private isRunning: boolean = false;

    constructor() {
        this.inputManager = new InputManager();
        this.audioManager = new AudioManager();
        this.playerData = new PlayerData('player', 'Trainer');
        this.networkService = new NetworkService('ws://localhost:8080');

        this.gameContext = {
            stateManager: null as unknown as StateManager,
            playerData: this.playerData,
            networkService: this.networkService,
            audioManager: this.audioManager
        };

        this.stateManager = new StateManager(this.inputManager);
        this.gameContext.stateManager = this.stateManager;
    }

    public getContext(): GameContext {
        return this.gameContext;
    }

    public start(): void {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    private loop(currentTime: number): void {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.inputManager.update();

        this.stateManager.update(deltaTime);

        this.stateManager.render();

        requestAnimationFrame((time) => this.loop(time));
    }
}