import { StatusEffect } from "./status-effect.interface";

export interface Character {
    playerId: string;
    characterId: string;
    className?: string;
    bios?: string;
    portraitUrl?: string;
    primaryStats: PrimaryStats;
    secondaryStats: SecondaryStats;
    equipments: Equipments;
    equipmentModifier: Array<StatusEffect>;
    statusEffects: Array<StatusEffect>;
    abilitiesId: Array<string>;
    skillsId: Array<string>;
    traitsId: Array<string>;
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
        className: '',
        bios: '',
        portraitUrl: '',
        primaryStats: {
            maxArmor: 6,
            armor: 6,
            dmgResistance: 6,
            maxHealth: 6,
            health: 6,
            maxStamina: 6,
            stamina: 6,
            maxPower: 6,
            power: 6,
            core_ranged: 6,
            rangedAttack: 6,
            rangedDmgModifier: 6,
            core_melee: 6,
            meleeAttack: 6,
            meleeDmgModifier: 6,
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
            core_critChance: 6,
            critChance: 6,
        },
        secondaryStats: {
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
            core_scoutScavange: 6,
            scoutScavange: 6,
            core_mining: 6,
            mining: 6,
            core_herbalism: 6,
            herbalism: 6,
            core_alchemy: 6,
            alchemy: 6,
            core_carryCapacity: 6,
            carryCapacity: 6,
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
        statusEffects: [],
        abilitiesId: [],
        skillsId: [],
        traitsId: [],
    }
    return character;
}
