export interface TrainerStats {
    gold: number;
    medals: number;
    playtimeSeconds: number;
}

export interface SerializedPlayerData {
    id: string;
    trainername: string;
    stats: TrainerStats;
}

export class PlayerData {
    private id: string;
    private trainername: string;
    private stats: TrainerStats;
    
    constructor(id: string, trainername: string) {
        this.id = id;
        this.trainername = trainername;
        this.stats = {
            gold: 1000,
            medals: 0,
            playtimeSeconds: 0
        };
    }

    public serialize(): SerializedPlayerData {
        return {
            id: this.id,
            trainername: this.trainername,
            stats: { ...this.stats }
        };
    }

    public deserialize(data: SerializedPlayerData): void {
        this.id = data.id;
        this.trainername = data.trainername;
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

    public gettrainername(): string {
        return this.trainername;
    }
}