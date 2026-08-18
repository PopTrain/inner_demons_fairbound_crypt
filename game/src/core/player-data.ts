export interface TrainerStats {
    gold: number;
    playtimeSeconds: number;
}

export interface SerializedDemonInstance {
    instanceId: string;
    speciesId: string;
    level: number;
    currentHp: number;
    exp: number;
    moves: string[];
    isGlittering: boolean;
}

export interface DemonaryEntry {
    seen: boolean;
    caught: boolean;
}

export type DemonaryProgression = Record<string, DemonaryEntry>;

export interface SerializedPlayerData {
    id: string;
    trainerName: string;
    stats: TrainerStats;
    party: SerializedDemonInstance[];
    demonary: DemonaryProgression;
    earnedMedals: string[];
}

export class PlayerData {
    private id: string;
    private trainerName: string;
    private stats: TrainerStats;
    private party: SerializedDemonInstance[];
    private demonary: DemonaryProgression;
    private earnedMedals: string[];
    
    constructor(id: string, trainerName: string) {
        this.id = id;
        this.trainerName = trainerName;
        this.stats = {
            gold: 1000,
            playtimeSeconds: 0
        };
        this.party = [];
        this.demonary = {};
        this.earnedMedals = [];
    }

    public serialize(): SerializedPlayerData {
        return {
            id: this.id,
            trainerName: this.trainerName,
            stats: { ...this.stats },
            party: this.party.map(demon => ({ 
                ...demon,
                moves: [...demon.moves] 
            })),
            demonary: JSON.parse(JSON.stringify(this.demonary)),
            earnedMedals: [...this.earnedMedals]
        };
    }

    public deserialize(data: SerializedPlayerData): void {
        this.id = data.id;
        this.trainerName = data.trainerName;
        this.stats = { ...data.stats };
        this.party = data.party ? data.party.map(demon => ({ 
            ...demon,
            moves: demon.moves ? [...demon.moves] : [] 
        })) : [];
        this.earnedMedals = data.earnedMedals ? [...data.earnedMedals] : [];
    }

    public getStats(): Readonly<TrainerStats> {
        return this.stats;
    }

    public addGold(amount: number): void {
        this.stats.gold = Math.max(0, this.stats.gold + amount);
    }

    public removeGold(amount: number): void {
        this.stats.gold = Math.max(0, this.stats.gold - amount);
    }

    public getId(): string {
        return this.id;
    }

    public gettrainerName(): string {
        return this.trainerName;
    }

    public getParty(): ReadonlyArray<SerializedDemonInstance> {
        return this.party;
    }

    public addDemonToParty(demon: SerializedDemonInstance, maxPartySize: number = 6): boolean {
        if (this.party.length < maxPartySize) {
            this.party.push({
                ...demon,
                moves: [...demon.moves]
            });
            this.registerDemonSeen(demon.speciesId);
            this.registerDemonCaught(demon.speciesId);
            return true;
        }
        return false;
    }

    public removeDemonFromParty(instanceId: string): boolean {
        const index = this.party.findIndex(d => d.instanceId === instanceId);
        if (index !== -1) {
            this.party.splice(index, 1);
            return true;
        }
        return false;
    }

    public getDemonary(): Readonly<DemonaryProgression> {
        return this.demonary;
    }

    public registerDemonSeen(speciesId: string): void {
        if (!this.demonary[speciesId]) {
            this.demonary[speciesId] = { seen: true, caught: false };
        } else {
            this.demonary[speciesId].seen = true;
        }
    }

    public registerDemonCaught(speciesId: string): void {
        if (!this.demonary[speciesId]) {
            this.demonary[speciesId] = { seen: true, caught: true };
        } else {
            this.demonary[speciesId].seen = true;
            this.demonary[speciesId].caught = true;
        }
    }

    public getEarnedMedals(): ReadonlyArray<string> {
        return this.earnedMedals;
    }

    public earnMedal(medalId: string): void {
        if (!this.earnedMedals.includes(medalId)) {
            this.earnedMedals.push(medalId);
        }
    }

    public hasMedal(medalId: string): boolean {
        return this.earnedMedals.includes(medalId);
    }

    public getMedalCount(): number {
        return this.earnedMedals.length;
    }
}