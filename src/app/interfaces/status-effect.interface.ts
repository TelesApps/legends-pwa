export interface StatusEffect {
    id?: string;
    stat: Stat;
    value: number;
    // add is standard, multiple_of means it should add the result of the multiplication
    application: 'add' | 'multiple_of' | 'multiply';
    duration?: number;
    durationCount?: number;
}



export enum Stat {
    MaxHealth, Health, MaxStamina, Stamina, MaxPower, Power, RangeAttack, MeleeAttack, MeleeDmgDelt, RangeDmdDelt, Defence,
    Strength, Agility, Accuracy, Perception, Mental, Movement, Crit, MaxArmor, Armor, DamageResistance, Counter, maxStress, minStress,
    stress, stressTolerance, stealth, lockPicking, quickHands, persuasion, intimidation, engineering, tracking, scoutScavange, mining,
    smithing, phiralSmith, herbalism, alchemy, cooking, musician, artist, carryCapacity
}

export enum BodyPart {
    Head, MainHand, OffHand, Chest, Hands, Legs, Feet, Trinkets
}