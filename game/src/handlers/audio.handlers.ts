import { AudioManager } from "../core/audio-manager";
import { type CommandHandler } from "./script-handlers";

export const audioHandlers: Record<string, CommandHandler> = {
    PLAY_AUDIO: (cmd, interpreter) => {
        if (cmd.type === 'PLAY_AUDIO') {
            AudioManager.playTrack(cmd.track, cmd.loop);
        }
        interpreter.executeNext();
    },

    STOP_AUDIO: (cmd, interpreter) => {
        if (cmd.type === 'STOP_AUDIO') {
            AudioManager.stopTrack(cmd.track);
        }
        interpreter.executeNext();
    }
};