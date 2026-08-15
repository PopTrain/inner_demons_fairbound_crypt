import { StateManager } from './state-manager';
import { InputManager } from './input-manager';

export class GameEngine {
    private lastTime: number = 0;
    private stateManager: StateManager;
    private inputManager: InputManager;
    private isRunning: boolean = false;

    constructor() {
        this.inputManager = new InputManager();
        this.stateManager = new StateManager(this.inputManager);
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