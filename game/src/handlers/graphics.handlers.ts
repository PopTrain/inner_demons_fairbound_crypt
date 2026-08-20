import { type ScriptCommand } from '../schemas/script.schema';
import { ScriptInterpreter } from '../core/script-interpreter';
import { type CommandHandler } from './script-handlers';

export const graphicsHandlers: Record<string, CommandHandler> = {
    FADE: (cmd: ScriptCommand, interpreter: ScriptInterpreter) => {
        if (cmd.type === 'FADE') {
            const graphics = interpreter.getGraphics();
            const duration = cmd.duration <= 10 ? cmd.duration * 1000 : cmd.duration;

            graphics.fadeScreen(cmd.direction, cmd.color, duration, () => {
                interpreter.executeNext();
            });
        }
    },

    SHOW_GRAPHIC: (cmd: ScriptCommand, interpreter: ScriptInterpreter) => {
        if (cmd.type === 'SHOW_GRAPHIC') {
            const graphics = interpreter.getGraphics();
            graphics.showGraphic(cmd.graphic, cmd.action, () => {
                interpreter.executeNext();
            });
        }
    },

    SHOW_TRAINER_SPRITE: (cmd: ScriptCommand, interpreter: ScriptInterpreter) => {
        if (cmd.type === 'SHOW_TRAINER_SPRITE') {
            const graphics = interpreter.getGraphics();
            graphics.showGraphic(cmd.sprite, 'in', () => {
                interpreter.executeNext();
            });
        }
    }
};