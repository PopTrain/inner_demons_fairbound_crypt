export type ElementalType =
    | 'Simple'
    | 'Plant'
    | 'Fire'
    | 'Water'
    | 'Electric'
    | 'Ice'
    | 'Air'
    | 'Bug'
    | 'Toxic'
    | 'Brawl'
    | 'Mind'
    | 'Dark'
    | 'Light'
    | 'Spirit'
    | 'Earth'
    | 'Crystal'
    | 'Metal'
    | 'Archaic';

export type Rank =
    | 'Kilo'
    | 'Mega'
    | 'Giga'
    | 'Tera'
    | 'Peta';

export interface BaseStats {
    hp: number;
    stamina: number;
    mattack: number;
    mdefense: number;
    rattack: number;
    rdefense: number;
    speed: number;
}

export interface Training {
    tpYield: number;
    baseExp: number;
    catchRate: number;
    growthRate: Array<'Slow' | 'Medium' | 'Fast' | 'Erratic'>;
}

export interface LevelUpMove {
    moveId: string;
    level: number;
}

export interface BaseMove {
    moveId: string;
}

export interface MovePool {
    levelUp: LevelUpMove[];
    moveManual: BaseMove[];
    tutor: BaseMove[];
}

export interface EvolutionCondition {
    targetSpeciesId: string;
    requiredLevel?: number;
    requiredStats?: Partial<BaseStats>;
    requiredItem?: string;
    requiresTrade?: boolean;
    requiresFriendship?: number;
}

export interface DemonSpeciesSchema {
    speciesId: string;
    rank: Rank;
    elementalTypes: ElementalType[];
    baseStats: BaseStats;
    training: Training;
    movePool: MovePool;
    evolutionRules: EvolutionCondition[];
}

export type DemonDatabase = Record<string, DemonSpeciesSchema>;