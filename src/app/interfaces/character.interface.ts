export interface Character {
    playerId: string;
    characterId: string;
    primaryStats: PrimaryStats
}

interface PrimaryStats {
    armor: number;
    maxHealth: number;
    health: number;
    maxStamina: number;
    stamina: number;
    maxPower: number;
    power: number;
    core_melee: number;
    weaponAttack: number;
    meleeWeaponSkillModifier: number;
    meleeAttack: number;
    core_ranged: number;
    rangedAttack: number;
    core_defense: number;
}