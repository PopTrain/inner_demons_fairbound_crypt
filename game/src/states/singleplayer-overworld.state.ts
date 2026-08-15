import { type GameState } from '../core/state.interface';
import { type GameContext } from '../core/game-context';

export class SinglePlayerOverworldState implements GameState {
    public name = 'SingleplayerOverworld'

    constructor(private context: GameContext) {}
    
    public enter(payload?: any): void {
        console.log(`Entering Overworld...`)
    }

    public exit(): void {
        console.log(`Leaving Overworld...`)
    }

    public pause(): void {
        console.log("Overworld paused.");
    }

    public resume(): void {
        console.log(`Overworld resumed.`);
    }

    public update(deltaTime: number): void {}

    public render(): void {}
}