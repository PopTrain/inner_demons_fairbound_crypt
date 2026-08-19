import * as PIXI from 'pixi.js';
import { SpriteManager } from './sprite-manager';

export abstract class CanvasComponent {
    protected spriteManager: SpriteManager;
    protected spriteId: string;
    protected container: PIXI.Container;
    public isVisible: boolean = false;
    
    constructor(spriteManager: SpriteManager, spriteId: string) {
        this.spriteManager = spriteManager;
        this.spriteId = spriteId;
        this.container = new PIXI.Container();
    }

    public abstract initialize(texturePath: string, x: number, y: number): Promise<void>;

    public show(): void {
        this.isVisible = true;
        const sprite = (this.spriteManager as any).sprites.get(this.spriteId);
        if (sprite) {
            sprite.visible = true;
        }
    }

    public hide(): void {
        this.isVisible = false;
        const sprite = (this.spriteManager as any).sprites.get(this.spriteId);
        if (sprite) {
            sprite.visible = false;
        }
    }

    public move(x: number, y: number): void {
        this.spriteManager.moveSprite(this.spriteId, x, y);
    }
}