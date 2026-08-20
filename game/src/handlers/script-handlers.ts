import { type ScriptCommand } from '../schemas/script.schema';
import { ScriptInterpreter } from '../core/script-interpreter';

export type CommandHandler = (command: ScriptCommand, interpreter: ScriptInterpreter) => void;