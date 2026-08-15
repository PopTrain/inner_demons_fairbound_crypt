import { type GameState } from './state.interface';

export class StateManager {
    private stateStack: GameState[] = [];
    private isTransitioning: boolean = false;

    public async pushState(newState: GameState, payload?: any): Promise<void> {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            if (this.stateStack.length > 0) {
                const currentState = this.stateStack[this.stateStack.length - 1];
                if (currentState.pause) await currentState.pause();
            }
            this.stateStack.push(newState);
            await newState.enter(payload);
        } finally {
            this.isTransitioning = false;
        }
    }

    public async popState(payload?: any): Promise<void> {
        if (this.stateStack.length === 0 || this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            const currentState = this.stateStack.pop();
            currentState?.exit();

            if (this.stateStack.length > 0) {
                const resumedState = this.stateStack[this.stateStack.length - 1];
                if (resumedState.resume) await resumedState.resume(payload);
            }
        } finally {
            this.isTransitioning = false;
        }
    }

    public async changeState(newState: GameState, payload?: any): Promise<void> {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            while (this.stateStack.length > 0) {
                const state = this.stateStack.pop();
                if (state) await state?.exit();
            }
            this.stateStack.push(newState);
            await newState.enter(payload);
        } finally {
            this.isTransitioning = false;
        }
    }

    public handleInput(action: string, data?: any): void {
        if (this.stateStack.length === 0 || this.isTransitioning) return;

        const activeState = this.stateStack[this.stateStack.length - 1];
        if (activeState.handleInput) {
            activeState.handleInput(action, data);
        }
    }

    public update(deltaTime: number): void {
        if (this.stateStack.length === 0 || this.isTransitioning) return;

        const activeState = this.stateStack[this.stateStack.length - 1];
        activeState.update(deltaTime);
    }

    public render(): void {
        if (this.stateStack.length === 0 || this.isTransitioning) return;

        const activeState = this.stateStack[this.stateStack.length - 1];
        activeState.render();
    }
}