import { type StateManager } from './state-manager';
import { type AudioManager } from './audio-manager';
import { type PlayerData } from './player-data';
import { type NetworkService } from './network-service';

export interface GameContext {
    stateManager: StateManager;
    audioManager: AudioManager;
    playerData: PlayerData;
    networkService: NetworkService;
}