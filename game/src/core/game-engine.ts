import { StateManager } from './state-manager';
import { AudioManager } from './audio-manager';
import { GraphicsManager } from './graphics-manager';
import { SpriteManager } from './sprite-manager';
import { PlayerData } from './player-data';
import { NetworkService } from './network-service';
import { InputManager } from './input-manager';
import { FontManager } from './font-manager';
import { LocalizationSystem } from './localization-manager';
import { type GameContext } from './game-context';

export class GameEngine {
    private lastTime: number = 0;
    private stateManager: StateManager;
    private audioManager: AudioManager;
    private graphicsManager: GraphicsManager;
    private spriteManager: SpriteManager;
    private playerData: PlayerData;
    private networkService: NetworkService;
    private inputManager: InputManager;
    private localizationManager: LocalizationSystem;
    private gameContext: GameContext;
    private isRunning: boolean = false;

    constructor(containerId: string) {
        this.inputManager = new InputManager();
        this.audioManager = new AudioManager();
        this.playerData = new PlayerData('player', 'Trainer');
        this.networkService = new NetworkService('ws://localhost:8080');

        this.graphicsManager = new GraphicsManager(containerId);
        this.spriteManager = new SpriteManager(this.graphicsManager.getStage());

        this.gameContext = {
            stateManager: null as unknown as StateManager,
            playerData: this.playerData,
            networkService: this.networkService,
            audioManager: this.audioManager,
            graphicsManager: this.graphicsManager,
            spriteManager: this.spriteManager,
            localizationManager: null as unknown as LocalizationSystem
        };

        this.stateManager = new StateManager(this.inputManager);
        this.gameContext.stateManager = this.stateManager;
    }

    public getContext(): GameContext {
        return this.gameContext;
    }

    public async init(): Promise<void> {
        await FontManager.preloadEngineFonts();
        console.log('[GameEngine] Fonts loaded successfully.');
        
        await this.graphicsManager.init();
        console.log('[GameEngine] Graphics initialized successfully.');

        try {
            this.localizationManager = new LocalizationSystem('en');

            const localeFiles = [
                'crops.csv',
                'demon_forms.csv',
                'demons.csv',
                'items.csv',
                'mementos.csv',
                'moves.csv',
                'personalities.csv',
                'personality_traits.csv',
                'phone.csv',
                'region_map.csv',
                'text.csv',
                'trainer_types.csv',
                'trainers.csv',
                'types.csv'
            ];

            for (const fileName of localeFiles) {
                const response = await fetch(`/locales/${fileName}`);
                if (!response.ok) {
                    console.warn(`[GameEngine] Warning: Could not load locale file '${fileName}' (${response.statusText})`);
                    continue;
                }
                const csvContent = await response.text();
                this.localizationManager.loadCSV(csvContent);
            }

            this.gameContext.localizationManager = this.localizationManager;
            console.log('[GameEngine] All localization files loaded and initialized successfully.');
        } catch (error) {
            console.error('[GameEngine] Error initializing localization system:', error);
        }
    }

    public start(): void {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.loop(time));
    }

    private loop(currentTime: number): void {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        this.inputManager.update();

        this.stateManager.update(deltaTime);

        this.stateManager.render();

        requestAnimationFrame((time) => this.loop(time));
    }
}