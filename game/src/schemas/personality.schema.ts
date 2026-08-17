import { StatType, PersonalityId, TraitId, type TraitTrigger } from './personality-traits.schema'

export interface DemonPersonality {
    id: PersonalityId;
    boostedStat: StatType;
}

export interface PersonalityTrait {
    id: TraitId;
    requiredPersonality: PersonalityId;
    trigger: TraitTrigger;
    effectPayload: {
        target: 'SELF' | 'OPPONENT' | 'FIELD';
        statModifier?: { stat: StatType; stages: number };
        damageModifier?: number;
        statusCondition?: string;
    };
}

export type PersonalityDatabase = Record<string, DemonPersonality>;

export type PersonalityTraitDatabase = Record<string, PersonalityTrait>;