import * as PIXI from 'pixi.js';

export type AssetDictionary = Record<string, string>;

export class SpriteManager {
    private stage: PIXI.Container;
    private sprites: Map<string, PIXI.Sprite> = new Map();
    private loadedStates: Set<string> = new Set();

    constructor(stage: PIXI.Container) {
        this.stage= stage;
    }

    public registerStates(states: Record<string, AssetDictionary>): void {
        for (const [stateId, assets] of Object.entries(states)) {
            PIXI.Assets.addBundle(stateId, assets);
        }
    }

    public async loadStateAssets(stateId: string): Promise<void> {
        if (this.loadedStates.has(stateId)) {
            console.log(`[SpriteManager] State '${stateId}' is already in memory.`);
            return;
        }

        console.log(`[SpriteManager] Loading assets for state: '${stateId}'...`);
        await PIXI.Assets.unloadBundle(stateId);
        this.loadedStates.delete(stateId);
    }

    public createSprite(id: string, textureAlias: string, x: number, y: number): PIXI.Sprite {
        if (this.sprites.has(id)) {
            console.warn(`[SpriteManager] Sprite with ID ${id} already exists.`);
            return this.sprites.get(id)!;
        }

        const texture = PIXI.Assets.get(textureAlias);

        if (!texture) {
            console.error(`[SpriteManager] Texture '${textureAlias}' not found. Did you forget to load its state?`);
            return null;
        }

        const sprite = new PIXI.Sprite(texture);
        sprite.x = x;
        sprite.y = y;

        this.sprites.set(id, sprite);
        this.stage.addChild(sprite);

        return sprite;
    }

    public async createDynamicSprite(id: string, texturePath: string, x: number, y: number): Promise<PIXI.Sprite | null> {
        if (this.sprites.has(id)) {
            return this.sprites.get(id)!;
        }

        try {
            const texture = await PIXI.Assets.load(texturePath);
            const sprite = new PIXI.Sprite(texture);

            sprite.x = x;
            sprite.y = y;

            this.sprites.set(id, sprite);
            this.stage.addChild(sprite);

            return sprite;
        } catch (error) {
            console.error(`[SpriteManager] Failed to load texture '${texturePath}'.`, error);
            return null;
        }
    }

    public moveSprite(id: string, x: number, y: number): void {
        const sprite = this.sprites.get(id);
        if (sprite) {
            sprite.x = x;
            sprite.y = y;
        }
    }

    public removeSprite(id: string): void {
        const sprite = this.sprites.get(id);
        if (sprite) {
            this.stage.removeChild(sprite);
            sprite.destroy();
            this.sprites.delete(id);
        }
    }
}