import { type GameState } from './state.interface';
import { InputManager } from './input-manager';

interface HistoryEntry {
    state: GameState;
    payload?: any;
}

export class StateManager {
    private stateStack: GameState[] = [];
    private historyStack: HistoryEntry[] = [];
    private isTransitioning: boolean = false;
    private inputManager: InputManager;

    constructor(inputManager: InputManager) {
        this.inputManager = inputManager;

        this.inputManager.setInputCallback((action, data) => {
            if (this.stateStack.length === 0 || this.isTransitioning) return;
            this.handleInput(action, data);
        });
    }

    public async pushState(newState: GameState, payload?: any): Promise<void> {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            if (this.stateStack.length > 0) {
                const currentState = this.stateStack[this.stateStack.length - 1];
                this.historyStack.push({ state: currentState, payload });

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

            if (this.historyStack.length > 0) {
                this.historyStack.pop();
            }

            if (this.stateStack.length > 0) {
                const resumedState = this.stateStack[this.stateStack.length - 1];
                if (resumedState.resume) await resumedState.resume(payload);
            }
        } finally {
            this.isTransitioning = false;
        }
    }

    public async goBack(payload?: any): Promise<void> {
        if (this.historyStack.length === 0 || this.isTransitioning) return;
        this.isTransitioning = true;

        try {
            const currentState = this.stateStack.pop();
            if (currentState) {
                await currentState.exit();
            }

            const previousEntry = this.historyStack.pop();

            if (previousEntry) {
                this.stateStack.push(previousEntry.state);

                if (previousEntry.state.resume) {
                    await previousEntry.state.resume(payload ?? previousEntry.payload);
                } else {
                    await previousEntry.state.enter(payload ?? previousEntry.payload);
                }
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
            this.historyStack = [];

            this.stateStack.push(newState);
            await newState.enter(payload);
        } finally {
            this.isTransitioning = false;
        }
    }

    public clearHistory(): void {
        this.historyStack = [];
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