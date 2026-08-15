import { type GameState } from '../core/state.interface';
import { type GameContext } from '../core/game-context';

export class CombatEncounterState implements GameState {
    public name = 'CombatEncounter';
    private enemyId: string = 'Unknown Entity';

    constructor(private context: GameContext) {}

    public enter(payload?: { enemyId: string }): void {
        if (payload?.enemyId) {
            this.enemyId = payload.enemyId;
        }
        console.log(`Battle started with ${this.enemyId}!`);
    }

    public exit(): void {
        console.log(`Battle ended with ${this.enemyId}.`);
    }

    public finishBattle(didWin: boolean): void {}

    public update(deltaTime: number): void {}

    public render(): void {}

    private wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}