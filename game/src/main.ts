import { GameEngine } from './core/game-engine';
import { DataManager } from './core/data-manager';
import './index.css';

window.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Game Engine...');

    const gameEngine = new GameEngine('game-container');

    (window as any).game = gameEngine;
    (window as any).gameContext = gameEngine.getContext();

    try {
        await DataManager.initialize();
        await gameEngine.init();
        
        gameEngine.start();
        console.log('Game Engine successfully started.');
    } catch (error) {
        console.error('Failed to initialize the Game Engine:', error);
    }
});