export interface StatusEffect {
    id?: number;
    stat: Stat;
    value: number;
    duration?: number;
    durationCount?: number;
}

export enum Stat {
    Health, Stamina, Power, RangeAttack, MeleeAttack, Defence, Strength, Agility, Accuracy, Perception, Mental, Movement,
    stealth, lockPicking, quickHands, persuasion, intimidation, engineering, tracking, scoutScavange, mining, herbalism, carryCapacity
}