import { type CommandHandler } from '../handlers/script-handlers';
import { audioHandlers } from '../handlers/audio.handlers';
import { dialogueHandlers } from '../handlers/dialogue.handlers';
import { graphicsHandlers } from '../handlers/graphics.handlers';

export const ScriptRegistry: Record<string, CommandHandler> = {
    ...audioHandlers,
    ...dialogueHandlers,
    ...graphicsHandlers,

    LABEL: (cmd, interpreter) => {
        if (cmd.type === 'LABEL') {
            console.log(`[ScriptRegistry] Interpreter passed label marker: ${cmd.name}`);
            
            interpreter.executeNext();
        } else {
            interpreter.executeNext();
        }
    }
}