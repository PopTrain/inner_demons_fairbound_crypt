import { type GameState } from '../core/state.interface';
import { type GameContext } from '../core/game-context';

export class IntroState implements GameState {
    public name = 'Intro';
    private elapsedTime: number = 0;
    private introDuration: number = 20.0;
    private hasTransitioned: boolean = false;

    constructor(private context: GameContext) {}

    public enter(payload?: any): void {
        console.log('Intro started. Playing studio logo.');

        if (payload) {
            if (payload.duration !== undefined) {
                this.introDuration = payload.duration;
            }
            if (payload.skipLogo) {
                console.log('Logo skipped via payload configuration.');
                this.proceedToTitleScreen();
                return;
            }
        }
    }

    public exit(): void {
        console.log('Intro finished: Cleaning up intro assets.');
    }

    public update(deltaTime: number): void {
        if (this.hasTransitioned) return;

        this.elapsedTime += deltaTime;

        if (this.elapsedTime >= this.introDuration) {
            this.proceedToTitleScreen();
        }
    }

    public handleInput(action: string, data?: any): void {
        if (data?.source) {
            console.log(`Input received from ${data.source} with action: ${action}`);
        }

        if ((action === 'interact' || action === 'cancel') && !this.hasTransitioned) {
            this.proceedToTitleScreen();
        }
    }

    public render(): void {}

    private proceedToTitleScreen(): void {
        this.hasTransitioned = true;
        (this.context as any).changeState('TitleScreen');
    }
}