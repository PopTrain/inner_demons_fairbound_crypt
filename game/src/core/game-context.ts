import { type StateManager } from './state-manager.js';
import { type AudioManager } from './audio-manager.js';
import { type GraphicsManager } from './graphics-manager.js';
import { type SpriteManager } from './sprite-manager.js';
import { type PlayerData } from './player-data.js';
import { type NetworkService } from './network-service.js';

export interface GameContext {
    stateManager: StateManager;
    audioManager: AudioManager;
    graphicsManager: GraphicsManager;
    spriteManager: SpriteManager;
    playerData: PlayerData;
    networkService: NetworkService;
}