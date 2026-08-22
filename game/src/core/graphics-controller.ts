import * as PIXI from 'pixi.js';
import { GraphicsManager } from './graphics-manager';

export class GraphicsController {
    private graphicsManager: GraphicsManager;
    private fadeGraphics: PIXI.Graphics;
    private activeSprites: Map<string, PIXI.Sprite> = new Map();

    constructor(graphicsManager: GraphicsManager) {
        this.graphicsManager = graphicsManager;
        this.fadeGraphics = new PIXI.Graphics();

        const stage = this.graphicsManager.getStage();
        this.fadeGraphics.zIndex = 9999;
        stage.sortableChildren = true;
        stage.addChild(this.fadeGraphics);
        this.updateFadeOverlay(0x000000, 0);
        this.fadeGraphics.visible = false;

        const canvas = this.graphicsManager.app.canvas;
        if (canvas) {
            (canvas as any).__graphicsController = this;
        }
    }

    public static getGraphics(): GraphicsController {
        const canvas = document.querySelector('canvas');
        
        if (canvas && (canvas as any).__graphicsController) {
            return (canvas as any).__graphicsController as GraphicsController;
        }
        
        throw new Error('[GraphicsController] Active graphics controller not found in the DOM.');
    }

    private parseColor(colorStr: string): number {
        if (colorStr.startsWith('#')) {
            return parseInt(colorStr.replace('#', ''), 16);
        }
        switch (colorStr.toLowerCase()) {
            case 'black': return 0x000000;
            case 'white': return 0xffffff;
            case 'red': return 0xff0000;
            case 'blue': return 0x0000ff;
            default: return 0x000000;
        }
    }

    private updateFadeOverlay(color: number, alpha: number): void {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        this.fadeGraphics.clear();
        this.fadeGraphics.rect(0, 0, screenWidth, screenHeight);
        this.fadeGraphics.setFillStyle({ color, alpha });
        this.fadeGraphics.fill();

    }

    public fadeScreen(
        direction: 'in' | 'out',
        colorStr: string,
        duration: number,
        onComplete?: () => void
    ): void {
        const color = this.parseColor(colorStr);
        this.fadeGraphics.visible = true;

        const startAlpha = direction === 'in' ? 1 : 0;
        const endAlpha = direction === 'in' ? 0 : 1;

        this.updateFadeOverlay(color, startAlpha);

        const startTime = performance.now();

        const animateFade = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1.0);
            const currentAlpha = startAlpha + (endAlpha - startAlpha) * progress;

            this.updateFadeOverlay(color, currentAlpha);

            if (progress < 1.0) {
                requestAnimationFrame(animateFade);
            } else {
                if (direction === 'in') {
                    this.fadeGraphics.visible = false;
                }
                if (onComplete) {
                    onComplete();
                }
            }
        };

        requestAnimationFrame(animateFade);
    }

    public showGraphic(graphicName: string, action: 'in' | 'out', onComplete?: () => void): void {
        const world = this.graphicsManager.getWorld();

        if (action === 'in') {
            const texture = PIXI.Texture.WHITE; 
            const sprite = new PIXI.Sprite(texture);
            sprite.anchor.set(0.5);
            sprite.x = window.innerWidth / 2;
            sprite.y = window.innerHeight / 2;
            
            world.addChild(sprite);
            this.activeSprites.set(graphicName, sprite);

            sprite.alpha = 0;
            const startTime = performance.now();
            const duration = 500;

            const fadeInSprite = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1.0);
                sprite.alpha = progress;

                if (progress < 1.0) {
                    requestAnimationFrame(fadeInSprite);
                } else if (onComplete) {
                    onComplete();
                }
            };
            requestAnimationFrame(fadeInSprite);
        } else {
            const sprite = this.activeSprites.get(graphicName);
            if (sprite) {
                const startTime = performance.now();
                const duration = 500;

                const fadeOutSprite = (currentTime: number) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1.0);
                    sprite.alpha = 1 - progress;

                    if (progress < 1.0) {
                        requestAnimationFrame(fadeOutSprite);
                    } else {
                        world.removeChild(sprite);
                        this.activeSprites.delete(graphicName);
                        if (onComplete) onComplete();
                    }
                };
                requestAnimationFrame(fadeOutSprite);
            } else {
                if (onComplete) onComplete();
            }
        }
    }
}