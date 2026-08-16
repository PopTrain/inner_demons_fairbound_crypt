import { type StateManager } from '../core/state-manager';
import { type PlayerData } from '../core/player-data';
import { type NetworkService } from '../core/network-service';

export interface GameContext {
    stateManager: StateManager;
    playerData: PlayerData;
    networkService: NetworkService;
}