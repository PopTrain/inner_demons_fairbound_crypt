export type InputAction = 'up' | 'down' | 'left' | 'right' | 'menu' | 'interact' | 'cancel' | 'special';

export class InputManager {
    private keyMap: Map<string, InputAction> = new Map();
    private gamepadButtonMap: Map<number, InputAction> = new Map();
    private activeActions: Set<InputAction> = new Set();
    private onInputCallback?: (action: InputAction, data?: any) => void;

    private previousGamepadState: Map<number, boolean[]> = new Map();

    constructor() {
        this.initializeDefaultKeyMap();
        this.initializeGamepadMap();
        this.attachEventListeners();
    }

    public setInputCallback(callback: (action: InputAction, data?: any) => void): void {
        this.onInputCallback = callback;
    }

    private initializeDefaultKeyMap(): void {
        this.keyMap.set('KeyW', 'up');
        this.keyMap.set('ArrowUp', 'up');
        this.keyMap.set('KeyS', 'down');
        this.keyMap.set('ArrowDown', 'down');
        this.keyMap.set('KeyA', 'left');
        this.keyMap.set('ArrowLeft', 'left');
        this.keyMap.set('KeyD', 'right');
        this.keyMap.set('ArrowRight', 'right');

        this.keyMap.set('KeyX', 'menu');
        this.keyMap.set('Enter', 'menu');
        this.keyMap.set('KeyC', 'interact');
        this.keyMap.set('Space', 'interact');
        this.keyMap.set('KeyZ', 'cancel');
        this.keyMap.set('Escape', 'cancel');
        this.keyMap.set('KeyD', 'special');
        this.keyMap.set('Shift', 'special');
    }

    private initializeGamepadMap(): void {
        this.gamepadButtonMap.set(12, 'up'); // D-Pad Up
        this.gamepadButtonMap.set(13, 'down'); // D-Pad Down
        this.gamepadButtonMap.set(14, 'left'); // D-Pad Left
        this.gamepadButtonMap.set(15, 'right'); // D-Pad Right

        this.gamepadButtonMap.set(0, 'interact'); // A / Cross
        this.gamepadButtonMap.set(1, 'cancel'); // B / Circle
        this.gamepadButtonMap.set(2, 'special'); // X / Square
        this.gamepadButtonMap.set(3, 'menu'); // Y / Triangle
    }

    private attachEventListeners(): void {
        window.addEventListener('keyup', (e: KeyboardEvent) => this.handleKeyUp(e));
        window.addEventListener('keydown', (e: KeyboardEvent) => this.handleKeyDown(e));

        const gameContainer = document.body;

        gameContainer.addEventListener('click', (e: MouseEvent) => this.handlePointerInput(e));
        gameContainer.addEventListener('touchstart', (e: TouchEvent) => this.handlePointerInput(e), { passive: false });
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const action = this.keyMap.get(event.code);
        if (action && !this.activeActions.has(action)) {
            this.activeActions.add(action);
            if (this.onInputCallback) {
                this.onInputCallback(action);
            }
        }
    }

    private handleKeyUp(event: KeyboardEvent): void {
        const action = this.keyMap.get(event.code);
        if (action) {
            this.activeActions.delete(action);
        }
    }

    private handlePointerInput(event: Event): void {
        const target = event.target as HTMLElement;

        const actionElement = target.closest('[data-action]') as HTMLElement;

        if (actionElement) {
            const rawAction = actionElement.getAttribute('data-action') as InputAction;
            const dataTarget = actionElement.getAttribute('data-target');

            if (rawAction) {
                event.preventDefault();

                if (this.onInputCallback) {
                    this.onInputCallback(rawAction, dataTarget);
                }
            }
        }
    }

    public update(): void {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (!gamepad) continue;

            if (!this.previousGamepadState.has(i)) {
                this.previousGamepadState.set(i, new Array(gamepad.buttons.length).fill(false));            
            }

            const prevState = this.previousGamepadState.get(i)!;

            for (const [buttonIndex, action] of this.gamepadButtonMap.entries()) {
                const button = gamepad.buttons[buttonIndex];

                if (!button) continue;

                const isPressed = button.pressed;
                const wasPressed = prevState[buttonIndex];

                if (isPressed && !wasPressed) {
                    this.activeActions.add(action);
                    if (this.onInputCallback) {
                        this.onInputCallback(action);
                    }
                } else if (!isPressed && wasPressed) {
                    this.activeActions.delete(action);
                }

                prevState[buttonIndex] = isPressed;
            }
        }
    }

    public isActionActive(action: InputAction): boolean {
        return this.activeActions.has(action);
    }
}