import { GraphicsController } from '../core/graphics-controller';
import { type CommandHandler } from './script-handlers';

export const graphicsHandlers: Record<string, CommandHandler> = {
    FADE: (cmd, interpreter) => {
        if (cmd.type === 'FADE') {
            const graphics = GraphicsController.getGraphics();
            const duration = cmd.duration <= 10 ? cmd.duration * 1000 : cmd.duration;

            graphics.fadeScreen(cmd.direction, cmd.color, duration, () => {
                interpreter.executeNext();
            });
        }
    },

    SHOW_GRAPHIC: (cmd, interpreter) => {
        if (cmd.type === 'SHOW_GRAPHIC') {
            const graphics = GraphicsController.getGraphics();
            graphics.showGraphic(cmd.graphic, cmd.direction || 'in', () => {
                interpreter.executeNext();
            });
        }
    },

    SHOW_TRAINER_SPRITE: (cmd, interpreter) => {
        if (cmd.type === 'SHOW_TRAINER_SPRITE') {
            const graphics = GraphicsController.getGraphics();
            graphics.showGraphic(cmd.sprite, 'in', () => {
                interpreter.executeNext();
            });
        }
    }
};