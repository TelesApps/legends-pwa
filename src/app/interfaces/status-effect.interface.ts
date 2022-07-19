export interface StatusEffect {
    id?: string;
    stat: Stat;
    value: number;
    duration?: number;
    durationCount?: number;
}

export enum Stat {
    Health, Stamina, Power, RangeAttack, MeleeAttack, DamageDelt, Defence, Strength, Agility, Accuracy, Perception, Mental, Movement,
    Crit, Armor, DamageResistance, Counter,
    stealth, lockPicking, quickHands, persuasion, intimidation, engineering, tracking, scoutScavange, mining, herbalism, carryCapacity
}