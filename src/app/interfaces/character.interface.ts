import { StatusEffect } from "./status-effect.interface";

export interface Character {
    playerId: string;
    characterId: string;
    primaryStats: PrimaryStats;
    secondaryStats: SecondaryStats;
    equipmentModifier: Array<StatusEffect>;
}

interface PrimaryStats {
    maxArmor: number;
    armor: number;
    dmgResistance: number;
    maxHealth: number;
    health: number;
    maxStamina: number;
    stamina: number;
    maxPower: number;
    power: number;
    core_ranged: number;
    rangedAttack: number;
    rangedDmgModifier: number;
    core_melee: number;
    meleeAttack: number;
    meleeDmgModifier: number;
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
    core_critChance: number;
    critChance: number;
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
    core_engineering: number;
    engineering: number;
    core_tracking: number;
    tracking: number;
    core_scoutScavange: number;
    scoutScavange: number;
    core_mining: number;
    mining: number;
    core_herbalism: number;
    herbalism: number;
    core_alchemy: number;
    alchemy: number;
    core_carryCapacity: number;
    carryCapacity: number;
}
