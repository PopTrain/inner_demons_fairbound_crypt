export enum StatType {
    M_ATTACK = 'mattack',
    M_DEFENSE = 'mdefense',
    R_ATTACK = 'rattack',
    R_DEFENSE = 'rdefense',
    SPEED = 'speed'
}

export enum PersonalityId {
    BRAVE = 'brave',
    STOIC = 'stoic',
    CUNNING = 'cunning',
    LOYAL = 'loyal',
    TIMID = 'timid'
}

export enum TraitId {
    HEROIC = 'heroic',
    DETERMINED = 'determined',
    IRON_WILL = 'iron_will',
    STALWART = 'stalwart',
    WEAK_POINT = 'weak_point',
    PRANKSTER = 'prankster',
    AMBUSH = 'ambush',
    VILLAINOUS = 'villainous'
}

export type TraitTrigger = 'ON_ENTER_BATTLE' | 'ON_ATTACK' | 'ON_DAMAGED' | 'ON_FAINT' | 'PASSIVE';