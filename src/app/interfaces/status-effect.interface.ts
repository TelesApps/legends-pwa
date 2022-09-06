export interface StatusEffect {
    id?: string;
    stat: Stat;
    value: number;
    duration?: number;
    durationCount?: number;
}

export enum Stat {
    MaxHealth, Health, MaxStamina, Stamina, MaxPower, Power, RangeAttack, MeleeAttack, MeleeDmgDelt, RangeDmdDelt, Defence, 
    Strength, Agility, Accuracy, Perception, Mental, Movement, Crit, MaxArmor, Armor, DamageResistance, Counter,
    stealth, lockPicking, quickHands, persuasion, intimidation, courage, engineering, tracking, scoutScavange, mining, smithing, herbalism, 
    alchemy, carryCapacity, phiralMining, phiralSmith
}