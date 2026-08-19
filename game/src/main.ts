import { GameEngine } from './core/game-engine';
import { DataManager } from './core/data-manager';
import { LocalizationSystem } from './core/localization-manager';
import { DialogueSystem } from './core/dialogue-manager';
import { DialogueBox } from './ui/dialogue-box';
import './index.css';

const bootstrapGame = async () => {
    console.log('Initializing Game Engine...');

    const gameEngine = new GameEngine('game-container');

    const localization = new LocalizationSystem();
    const dialogueSystem = new DialogueSystem(localization, { maxLineLength: 32, linesPerPage: 3 });

    const dialogueBox = new DialogueBox(dialogueSystem);

    (window as any).game = gameEngine;
    (window as any).gameContext = gameEngine.getContext();

    try {
        dialogueBox.render(document.body);
        
        await DataManager.initialize();
        await gameEngine.init();
        
        gameEngine.start();
        console.log('Game Engine successfully started.');
    } catch (error) {
        console.error('Failed to initialize the Game Engine:', error);
    }
};

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootstrapGame);
} else {
    bootstrapGame();
}