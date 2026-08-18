import * as PIXI from 'pixi.js';

export class Camera {
    private world: PIXI.Container;
    private app: PIXI.Application;

    private target: PIXI.Sprite | null = null;
    private followSpeed: number = 0.1;

    public minZoom: number = 0.5;
    public maxZoom: number = 3.0;

    constructor(app: PIXI.Application, world: PIXI.Container) {
        this.app = app;
        this.world = world;
    }

    public follow(target: PIXI.Sprite): void {
        this.target = target;
    }

    public unfollow(): void {
        this.target = null;
    }

    public setPosition(x: number, y: number): void {
        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;

        this.world.x = screenWidth / 2 - x * this.world.scale.x;
        this.world.y = screenHeight / 2 - y * this.world.scale.y;
    }

    public zoom(zoomFactor: number, screenCenter?: { x: number; y: number }): void {
        const oldScale = this.world.scale.x;
        let newScale = oldScale * zoomFactor

        newScale = Math.max(this.minZoom, Math.min(this.maxZoom, newScale));

        const center = screenCenter || {
            x: this.app.screen.width / 2,
            y: this.app.screen.height / 2
        };

        this.world.x = center.x - (center.x - this.world.x) * (newScale / oldScale);
        this.world.y = center.y - (center.y - this.world.y) * (newScale / oldScale);

        this.world.scale.set(newScale);
    }

    public update(): void {
        if (this.target) {
            const screenWidth = this.app.screen.width;
            const screenHeight = this.app.screen.height;

            const targetX = this.target.x;
            const targetY = this.target.y;

            const desiredX = screenWidth / 2 - targetX * this.world.scale.x;
            const desiredY = screenHeight / 2 - targetY * this.world.scale.y;

            this.world.x += (desiredX - this.world.x) * this.followSpeed;
            this.world.y += (desiredY - this.world.y) * this.followSpeed;
        }
    }
}