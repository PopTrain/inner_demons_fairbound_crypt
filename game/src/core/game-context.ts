import { type StateManager } from './state-manager';
import { type AudioManager } from './audio-manager';
import { type GraphicsManager } from './graphics-manager';
import { type SpriteManager } from './sprite-manager';
import { type UIManager } from './ui-manager';
import { type LocalizationSystem } from './localization-manager';
import { type PlayerData } from './player-data';
import { type NetworkService } from './network-service';

export interface GameContext {
    stateManager: StateManager;
    audioManager: AudioManager;
    graphicsManager: GraphicsManager;
    spriteManager: SpriteManager;
    uiManager: UIManager;
    localizationManager: LocalizationSystem;
    playerData: PlayerData;
    networkService: NetworkService;
}