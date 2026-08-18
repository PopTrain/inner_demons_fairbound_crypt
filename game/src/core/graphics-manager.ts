import 'pixi.js/unsafe-eval';
import * as PIXI from 'pixi.js';

export class GraphicsManager {
    public app: PIXI.Application;
    public world: PIXI.Container;
    private containerElement: HTMLElement;

    constructor(containerId: string) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`[GraphicsManager] Container #${containerId} not found in the DOM.`);
        }
        this.containerElement = container;

        this.app = new PIXI.Application();
        this.world = new PIXI.Container();
    }

    public async init(): Promise<void> {
        await this.app.init({
            resizeTo: window,
            autoDensity: true,
            resolution: window.devicePixelRatio || 1,
        });

        this.containerElement.appendChild(this.app.canvas);
        this.app.stage.addChild(this.world);
    }

    public getStage(): PIXI.Container {
        return this.app.stage;
    }

    public getWorld(): PIXI.Container {
        return this.world;
    }

    public onTick(tickerCallback: (ticker: PIXI.Ticker) => void): void {
        this.app.ticker.add(tickerCallback);
    }
}