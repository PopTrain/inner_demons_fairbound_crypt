export interface GameState {
    name: string,

    enter(payload?: any): Promise<void> | void;

    exit(): Promise<void> | void;

    update(deltaTime: number): void;

    render(): void;

    handleInput?(action: string, data?: any): void;

    pause?(): void | Promise<void>;

    resume?(payload?: any): void | Promise<void>;
}