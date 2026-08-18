import { type StateManager } from './state-manager';
import { type AudioManager } from './audio-manager';
import { type GraphicsManager } from './graphics-manager';
import { type SpriteManager } from './sprite-manager';
import { type PlayerData } from './player-data';
import { type NetworkService } from './network-service';

export interface GameContext {
    stateManager: StateManager;
    audioManager: AudioManager;
    graphicsManager: GraphicsManager;
    spriteManager: SpriteManager;
    playerData: PlayerData;
    networkService: NetworkService;
}