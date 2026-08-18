import type { FlagId, VariableId, FlagVariablePayload } from '../schemas/flag.schema';

export class FlagManager {
    private flags: Map<FlagId, boolean> = new Map();
    private variables: Map<VariableId, number> = new Map();

    constructor(initialState?: FlagVariablePayload) {
        if (initialState) {
            this.loadState(initialState);
        }
    }

    public setFlag(id: FlagId, value: boolean): void {
        this.flags.set(id, value);
    }

    public getFlag(id: FlagId): boolean {
        return this.flags.get(id) ?? false;
    }

    public setVariable(id: VariableId, value: number): void {
        this.variables.set(id, value);
    }

    public getVariable(id: VariableId): number {
        return this.variables.get(id) ?? 0;
    }

    public incrementVariable(id: VariableId, amount: number = 1): number {
        const current = this.getVariable(id);
        const updated = current + amount;
        this.variables.set(id, updated);
        return updated;
    }

    public loadState(payload: FlagVariablePayload): void {
        this.flags.clear();
        if (payload.flags) {
            for (const[key, value] of Object.entries(payload.flags)) {
                this.flags.set(key, value);
            }
        }

        this.variables.clear();
        if (payload.variables) {
            for (const [key, value] of Object.entries(payload.variables)) {
                this.variables.set(key, value);
            }
        }
    }

    public serialize(): FlagVariablePayload {
        const flagsObj: Record<FlagId, boolean> = {};
        this.flags.forEach((value, key) => {
            flagsObj[key] = value;
        });

        const varsObj: Record<VariableId, number> = {};
        this.variables.forEach((value, key) => {
            varsObj[key] = value;
        });

        return {
            flags: flagsObj,
            variables: varsObj
        };
    }
}