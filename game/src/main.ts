import { GameEngine } from './core/game-engine';
import './index.css';

window.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Game Engine...');

    const gameEngine = new GameEngine();

    (window as any).game = gameEngine;
    (window as any).gameContext = gameEngine.getContext();

    gameEngine.start();
    console.log('Game Engine successfully started.');
});