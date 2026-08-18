import { type GameState } from '../core/state.interface';
import { type GameContext } from '../core/game-context';

export class TitleScreenState implements GameState {
    public name = 'TitleScreen';
    private blinkTimer: number = 0;
    private isPressStartVisible: boolean = true;
    private idleTimer: number = 0;
    private idleTimeout: number = 60.0;
    private hasTransitioned: boolean = false;

    constructor(private context: GameContext) {}

    public enter(payload?: any): void {
        console.log('Title Screen loaded.');
        this.idleTimer = 0;
        this.hasTransitioned = false;

        if (payload?.message) {
            console.log(`System notice: ${payload.message}`);
        }
    }

    public exit(): void {
        console.log('Exiting Title Screen.');
    }

    public update(deltaTime: number): void {
        this.blinkTimer += deltaTime;
        if (this.blinkTimer >= 0.5) {
            this.isPressStartVisible = !this.isPressStartVisible;
            this.blinkTimer = 0;
        }

        this.idleTimer += deltaTime;
        if (this.idleTimer >= this.idleTimeout) {
            this.revertToIntroScreen();
        }
    }

    public handleInput(action: string, _data?: any): void {
        if (this.hasTransitioned) return;

        if (action) {
            this.proceedToSavesMenu();
        }
    }

    public render(): void {}

    private proceedToSavesMenu(): void {
        if (this.hasTransitioned) return;
        this.hasTransitioned = true;
        (this.context as any).changeState('SavesMenu');
    }

    private revertToIntroScreen(): void {
        if (this.hasTransitioned) return;
        this.hasTransitioned = true;
        (this.context as any).changeState('Intro');
    }
}