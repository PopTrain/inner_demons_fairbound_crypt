import { type GameState } from '../core/state.interface';
import { type GameContext } from '../core/game-context';

export class SinglePlayerOverworldState implements GameState {
    public name = 'SingleplayerOverworld'
    private playTime: number = 0;
    private currentSpawnLocation: string = '';

    constructor(private context: GameContext) {}
    
    public enter(payload?: any): void {
        this.currentSpawnLocation = payload?.location || 'Default Spawn';
        console.log(`Entering Overworld map at: ${this.currentSpawnLocation}`);
    }

    public exit(): void {
        console.log(`Cleaning up map assets for: ${this.currentSpawnLocation}`);
    }

    public pause(): void {
        console.log("Overworld paused.");
    }

    public resume(): void {
        console.log(`Overworld resumed.`);
    }

    public update(deltaTime: number): void {
        this.playTime += deltaTime;
    }

    public render(): void {
        if (this.currentSpawnLocation !== '') {}
    }

    public openStartMenu(): void {
        console.log('Opening menu.');

        if (typeof (this.context as any).changeState === 'function') {
            (this.context as any).changeState('StartMenuState', {
                timePlayed: this.playTime,
                lastLocation: this.currentSpawnLocation
            });
        }
    }
}