import { DialogueBox } from '../ui/dialogue-box';
import { ChoiceBox } from '../ui/choice-box';
import { type CommandHandler } from './script-handlers';

export const dialogueHandlers: Record<string, CommandHandler> = {
    TEXT: (cmd, interpreter) => {
        if (cmd.type === 'TEXT') {
            DialogueBox.startDialogue(cmd.key, () => {
                interpreter.executeNext();
            });
        }
    },

    NAME_BOX: (cmd, interpreter) => {
        if (cmd.type === 'NAME_BOX') {
            DialogueBox.setNameBox(cmd.key);
        }
        interpreter.executeNext();
    },

    CHOICE: (cmd, interpreter) => {
        if (cmd.type === 'CHOICE') {
            ChoiceBox.showChoices(cmd.options, (selectedOption) => {
                interpreter.jumpToLabel(selectedOption);
                interpreter.executeNext();
            });
        }
    }
};