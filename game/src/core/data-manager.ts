import { type DemonSpeciesSchema } from "../schemas/demon.schema";

export class DataManager {
    public static demons: Map<string, DemonSpeciesSchema> = new Map();

    public static async initialize(): Promise<void> {
        console.log('Initializing DataManager...');

        try {
            await Promise.all([
                this.loadDemons(),
            ]);

            console.log('All game data loaded successfully.');

            this.validateLoad();
        } catch (error) {
            console.error('Critical Error: Failed to load game data.', error);
        }
    }

    private static async loadDemons(): Promise<void> {
        const response = await fetch('/data/demons.json');

        if (!response.ok) {
            throw new Error(`Failed to fetch demons.json. HTTP Status: ${response.status}`);
        }
        
        const data = await response.json();

        for (const key in data) {
            this.demons.set(key, data[key] as DemonSpeciesSchema);
        }
    }

    private static validateLoad(): void {
        console.group('DataManager Registry Status');
        console.log(`Demons Loaded: ${this.demons.size}`);
        console.groupEnd();

        if (this.demons.size > 0) {
            const firstKey = this.demons.keys().next().value;
            console.log(`Sample Record [${firstKey}]:`, this.demons.get(firstKey));
        }
    }

    public static getDemon(speciesId: string): DemonSpeciesSchema | undefined {
        return this.demons.get(speciesId);
    }
}