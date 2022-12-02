import { StatusEffect } from "./status-effect.interface";

export interface Character {
    playerId: string;
    characterId: string;
    characterName: string;
    classTitle?: string;
    bios?: string;
    portraitUrl?: string;
    primaryStats: PrimaryStats;
    secondaryStats: SecondaryStats;
    equipments: Equipments;
    equipmentModifier: Array<StatusEffect>;
    skillTraitsModifiers: Array<StatusEffect>;
    statusEffects: Array<StatusEffect>;
    abilitiesId: Array<string>;
    skillsTraitsId: Array<string>;
    isPlayerUsing?: boolean;
}

interface PrimaryStats {
    core_maxArmor: number;
    maxArmor: number;
    armor: number;
    dmgResistance: number;
    core_maxHealth: number;
    maxHealth: number;
    health: number;
    core_maxStamina: number;
    maxStamina: number;
    stamina: number;
    core_maxPower: number;
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
    max_stress: number,
    min_stress: number
    stress: number,
    core_stressTolerance: number,
    stress_tolerance: number,
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
    core_mining: number;
    mining: number;
    core_smithing: number;
    smithing: number;
    core_phiralSmithing: number;
    phiralSmithing: number;
    core_herbalism: number;
    herbalism: number;
    core_alchemy: number;
    alchemy: number;
    core_cooking: number;
    cooking: number;
    core_musician: number;
    musician: number;
    core_artist: number;
    artist: number;
    core_carryCapacity: number;
    carryCapacity: number;
}

interface Equipments {
    headId: string;
    mainHandId: string;
    offHandId: string;
    chestId: string;
    handsId: string;
    legsId: string;
    feetId: string;
    trinketsId: Array<string>;
    backPack: Array<string>;
    goldCoins: number;
}

export function CreateNewCharacter() {
    const character: Character = {
        playerId: '',
        characterId: '',
        characterName: '',
        classTitle: '',
        bios: '',
        portraitUrl: '',
        primaryStats: {
            core_maxArmor: 0,
            maxArmor: 0,
            armor: 0,
            dmgResistance: 0,
            core_maxHealth: 40,
            maxHealth: 40,
            health: 40,
            core_maxStamina: 60,
            maxStamina: 60,
            stamina: 60,
            core_maxPower: 60,
            maxPower: 60,
            power: 60,
            core_ranged: 6,
            rangedAttack: 6,
            rangedDmgModifier: 0,
            core_melee: 6,
            meleeAttack: 6,
            meleeDmgModifier: 0,
            core_defense: 6,
            defense: 6,
            core_strength: 6,
            strength: 6,
            core_agility: 6,
            agility: 6,
            core_accuracy: 6,
            accuracy: 6,
            core_perception: 6,
            perception: 6,
            core_mental: 6,
            mental: 6,
            core_movement: 6,
            movement: 6,
            core_critChance: 0.05,
            critChance: 6,
        },
        secondaryStats: {
            max_stress: 1,
            min_stress: 0,
            stress: .08,
            core_stressTolerance: .35,
            stress_tolerance: .35,
            core_stealth: 6,
            stealth: 6,
            core_lockPicking: 6,
            lockPicking: 6,
            core_quickHands: 6,
            quickHands: 6,
            core_persuasion: 6,
            persuasion: 6,
            core_intimidation: 6,
            intimidation: 6,
            core_engineering: 6,
            engineering: 6,
            core_tracking: 6,
            tracking: 6,
            core_mining: 6,
            mining: 6,
            core_smithing: 6,
            smithing: 6,
            core_phiralSmithing: 6,
            phiralSmithing: 6,
            core_herbalism: 6,
            herbalism: 6,
            core_alchemy: 6,
            alchemy: 6,
            core_cooking: 6,
            cooking: 6,
            core_musician: 6,
            musician: 6,
            core_artist: 6,
            artist: 6,
            core_carryCapacity: 90,
            carryCapacity: 90,
        },
        equipments: {
            headId: '',
            mainHandId: '',
            offHandId: '',
            chestId: '',
            handsId: '',
            legsId: '',
            feetId: '',
            trinketsId: [],
            backPack: [],
            goldCoins: 0,
        },
        equipmentModifier: [],
        skillTraitsModifiers: [],
        statusEffects: [],
        abilitiesId: [],
        skillsTraitsId: [],
    }
    return character;
}
