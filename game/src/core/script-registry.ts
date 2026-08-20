import { type CommandHandler } from '../handlers/script-handlers';
import { audioHandlers } from '../handlers/audio.handlers';
import { dialogueHandlers } from '../handlers/dialogue.handlers';
import { GraphicsManager } from './graphics-manager';

export const ScriptRegistry: Record<string, CommandHandler> = {
    ...audioHandlers,
    ...dialogueHandlers,

    FADE: (cmd, interpreter) => {
        if (cmd.type === 'FADE') {
            GraphicsManager.fadeScreen(cmd.direction, cmd.color, cmd.duration, () => {
                interpreter.executeNext();
            });
        }
    },

    LABEL: (cmd, interpreter) => {
        interpreter.executeNext();
    }
}