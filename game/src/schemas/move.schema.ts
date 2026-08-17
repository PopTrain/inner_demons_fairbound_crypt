import { type ElementalType } from './demon.schema';

export type MoveCategory = 'Melee' | 'Ranged' | 'Status';

export type StatusAilment =
    | 'Burn'
    | 'Frostbite'
    | 'Paralysis'
    | 'Poison'
    | 'Sleep'
    | 'Confuse';

export interface StatModifier {
    stat: 'hp' | 'stamina' | 'mattack' | 'mdefense' | 'rattack' | 'rdefense' | 'speed';
    stages: number;
    target: 'self' | 'opponent';
}

export interface SecondaryEffect {
    chance: number;
    statusAilment?: StatusAilment;
    statModifiers?: StatModifier[];
}

export interface DemonMoveSchema {
    moveId: string;
    elementalType: ElementalType;
    category: MoveCategory;
    power: number;
    accuracy: number;
    energyCost: number;
    priority: number;
    makesContact: boolean;
    secondaryEffect?: SecondaryEffect;
}

export type MoveDatabase = Record<string, DemonMoveSchema>;