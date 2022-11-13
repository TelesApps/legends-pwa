import { Injectable } from '@angular/core';
import { Character } from '../interfaces/character.interface';
import { Stat, StatusEffect } from '../interfaces/status-effect.interface';

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {

  constructor() { }

  calculateEffectsFromStrings(effects: string[], id?: string, isRanged?: boolean) {
    const statusEffects: StatusEffect[] = [];
    effects.forEach(effect => {
      const valuestringArray = effect.match(/-?\d+/g);
      let valueString;
      if (valuestringArray && valuestringArray.length > 0)
        valueString = valuestringArray[0];
      if (effect.includes('%')) {
        console.log('String is a percentage');
        valueString = (Number.parseFloat(valueString) / 100).toPrecision(1);
      }
      const statusStringArray = effect.match(/[a-zA-Z]+/g)
      let statusString;
      if (statusStringArray && statusStringArray.length > 0) {
        statusString = statusStringArray[0].toLowerCase();
      }
      let status: Stat;
      if (statusString === 'maxh' || statusString === 'maxhealth') status = Stat.MaxHealth;
      if (statusString === 'h' || statusString === 'health') status = Stat.Health;
      if (statusString === 'maxs' || statusString === 'maxstamina' || statusString === 'maxstam') status = Stat.MaxStamina;
      if (statusString === 'stam' || statusString === 'stamina') status = Stat.Stamina;
      if (statusString === 'maxp' || statusString === 'maxpower') status = Stat.MaxPower;
      if (statusString === 'p' || statusString === 'power') status = Stat.Power;
      if (statusString === 'ra' || statusString === 'rangedattack') status = Stat.RangeAttack;
      if (statusString === 'a' || statusString === 'attack') status = Stat.MeleeAttack;
      if (statusString === 'ma' || statusString === 'melee') status = Stat.MeleeAttack;
      if (statusString === 'counter' || statusString === 'cntr') status = Stat.Counter;
      if (statusString === 'dmg' || statusString === 'damage') {
        if (isRanged) status = Stat.RangeDmdDelt
        else status = Stat.MeleeDmgDelt;
      }
      if (statusString === 'd' || statusString === 'defence') status = Stat.Defence;
      if (statusString === 'str' || statusString === 'strength') status = Stat.Strength;
      if (statusString === 'ag' || statusString === 'agility') status = Stat.Agility;
      if (statusString === 'acc' || statusString === 'accuracy') status = Stat.Accuracy;
      if (statusString === 'per' || statusString === 'perc' || statusString === 'perception' ||
        statusString === 'awar' || statusString === 'awarness') status = Stat.Perception;
      if (statusString === 'm' || statusString === 'mental') status = Stat.Mental;
      if (statusString === 'mov' || statusString === 'movement') status = Stat.Movement;
      if (statusString === 'crit') status = Stat.Crit;
      if (statusString === 'armor' || statusString === 'armore') status = Stat.MaxArmor;
      if (statusString === 'res' || statusString === 'resistance') status = Stat.DamageResistance;

      if (statusString === 'maxStr' || statusString === 'maxstress') status = Stat.maxStress;
      if (statusString === 'minStr' || statusString === 'minstress') status = Stat.minStress;
      if (statusString === 'strss' || statusString === 'stress') status = Stat.stress;
      if (statusString === 'strssTol' || statusString === 'stresstol' || statusString === 'stresstolerance') status = Stat.stressTolerance;
      if (statusString === 'sth' || statusString === 'stealth') status = Stat.stealth;
      if (statusString === 'lckp' || statusString === 'lockpick' || statusString === 'lockpicking') status = Stat.lockPicking;
      if (statusString === 'quckh' || statusString === 'quickhands' || statusString === 'quickh') status = Stat.quickHands;
      if (statusString === 'per' || statusString === 'persuasion') status = Stat.persuasion;
      if (statusString === 'inti' || statusString === 'intimidation') status = Stat.intimidation;
      if (statusString === 'eng' || statusString === 'engineering') status = Stat.engineering;
      if (statusString === 'track' || statusString === 'tracking') status = Stat.tracking;
      if (statusString === 'mine' || statusString === 'mining') status = Stat.mining;
      if (statusString === 'smith' || statusString === 'smithing') status = Stat.smithing;
      if (statusString === 'psmith' || statusString === 'phiralsmithing' || statusString === 'phiralsmith') status = Stat.phiralSmith;
      if (statusString === 'herb' || statusString === 'herbalism') status = Stat.herbalism;
      if (statusString === 'alch' || statusString === 'alchemy') status = Stat.alchemy;
      if (statusString === 'cook' || statusString === 'cooking') status = Stat.cooking;
      if (statusString === 'music' || statusString === 'musician') status = Stat.musician;
      if (statusString === 'art' || statusString === 'artist') status = Stat.artist;
      if (statusString === 'carry' || statusString === 'carrycapacity') status = Stat.carryCapacity;
      if (!status) return
      const statEffect: StatusEffect = {
        id: id,
        stat: status,
        value: Number.parseFloat(valueString),
      }
      statusEffects.push(statEffect);
      // console.log('Effects', { valueString, statusString });
    });
    return statusEffects;
  }

}
