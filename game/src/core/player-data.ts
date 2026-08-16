export interface TrainerStats {
    gold: number;
    medals: number;
    playtimeSeconds: number;
}

export interface SerializedPlayerData {
    id: string;
    username: string;
    stats: TrainerStats;
}

export class PlayerData {
    private id: string;
    private username: string;
    private stats: TrainerStats;
    
    constructor(id: string, username: string) {
        this.id = id;
        this.username = username;
        this.stats = {
            gold: 1000,
            medals: 0,
            playtimeSeconds: 0
        };
    }

    public serialize(): SerializedPlayerData {
        return {
            id: this.id,
            username: this.username,
            stats: { ...this.stats }
        };
    }

    public deserialize(data: SerializedPlayerData): void {
        this.id = data.id;
        this.username = data.username;
        this.stats = { ...data.stats };
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

    public awardMedal(): void {
        this.stats.medals += 1;
    }

    public getId(): string {
        return this.id;
    }

    public getUsername(): string {
        return this.username;
    }
}