import { type ScriptCommand } from '../schemas/script.schema';
import { ScriptRegistry } from './script-registry';

export class ScriptInterpreter {
    private queue: ScriptCommand[] = [];
    private currentIndex: number = 0;
    private isRunning: boolean = false;
    private labels: Map<string, number> = new Map();

    public isRunningActive(): boolean {
        return this.isRunning;
    }

    public loadScript(commands: ScriptCommand[]) {
        this.queue = commands;
        this.currentIndex = 0;
        this.isRunning = true;
        this.indexLabels();
        this.executeNext();
    }

    private indexLabels() {
        this.labels.clear();
        this.queue.forEach((cmd, index) => {
            if (cmd.type === 'LABEL') {
                this.labels.set(cmd.name, index);
            }
        });
    }

    public jumpToLabel(labelName: string) {
        const targetIndex = this.labels.get(labelName);
        if (targetIndex !== undefined) {
            this.currentIndex = targetIndex;
        } else {
            console.warn(`Scripting warning: Label ${labelName} not found.`);
        }
    }

    public executeNext() {
        if (!this.isRunning || this.currentIndex >= this.queue.length) {
            this.isRunning = false;
            return;
        }

        const command = this.queue[this.currentIndex++];
        const handler = ScriptRegistry[command.type];

        if (handler) {
            handler(command, this);
        } else {
            console.error(`No handler registered for command type: ${command.type}`);
            this.executeNext();
        }
    }
}