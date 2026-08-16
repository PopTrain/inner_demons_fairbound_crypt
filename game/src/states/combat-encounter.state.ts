import { type GameState } from '../core/state.interface';
import { type GameContext } from '../core/game-context';

export class CombatEncounterState implements GameState {
    public name = 'CombatEncounter';
    private enemyId: string = 'Unknown Entity';
    private timeInCombat: number = 0;

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

    public async finishBattle(didWin: boolean): Promise<void> {
        if (didWin) {
            console.log(`Victory! You have defeated ${this.enemyId}.`);
        } else {
            console.log(`Defeat... ${this.enemyId} was too strong.`);
        }

        console.log('Returning to overworld in 2 seconds...');
        await this.wait(2000);

        if (typeof (this.context as any).changeState === 'function') {
            (this.context as any).changeState('SinglePlayerOverworld');
        }
    }

    public update(deltaTime: number): void {
        this.timeInCombat += deltaTime;
    }

    public render(): void {}

    private wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}