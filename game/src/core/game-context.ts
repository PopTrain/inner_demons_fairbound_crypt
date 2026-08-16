import { type StateManager } from './state-manager.js';
import { type AudioManager } from './audio-manager.js';
import { type PlayerData } from './player-data.js';
import { type NetworkService } from './network-service.js';

export interface GameContext {
    stateManager: StateManager;
    audioManager: AudioManager;
    playerData: PlayerData;
    networkService: NetworkService;
}