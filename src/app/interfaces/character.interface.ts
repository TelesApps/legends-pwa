export interface Character {
    playerId: string;
    characterId: string;
    primaryStats: PrimaryStats
    equipmentModifier: Array<StatusEffect>;
}

interface PrimaryStats {
    armor: number;
    maxHealth: number;
    health: number;
    maxStamina: number;
    stamina: number;
    maxPower: number;
    power: number;
    core_ranged: number;
    rangedAttack: number;
    core_melee: number;
    meleeAttack: number;
    core_defense: number;
    defense: number;
    core_strength: number;
    strength: number;
    core_agility: number;
    agility: number;
    core_accuracy: number;
    accuracy: number;
    core_perception: number;
    perception: number;
    core_mental: number;
    mental: number;
    core_movement: number;
    movement: number;
}

interface SecondaryStats {
    core_stealth: number;
    stealth: number;
    core_lockPicking: number;
    lockPicking: number;
    core_quickHands: number;
    quickHands: number;
    core_persuasion: number;
    persuasion: number;
    core_intimidation: number;
    intimidation: number;
}

interface StatusEffect {
    id?: number;
    stat: string;
    value: number;
    duration?: number;
    durationCount?: number;
}