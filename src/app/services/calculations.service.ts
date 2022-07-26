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
      console.log(effect);
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
      if (statusString === 'h' || statusString === 'health') status = Stat.Health;
      if (statusString === 'stam' || statusString === 'stamina') status = Stat.Stamina;
      if (statusString === 'p' || statusString === 'power') status = Stat.Power;
      if (statusString === 'ra' || statusString === 'rangedattack') status = Stat.RangeAttack;
      if (statusString === 'a' || statusString === 'attack') status = Stat.MeleeAttack;
      if (statusString === 'ma' || statusString === 'melee') status = Stat.MeleeAttack;
      if (statusString === 'counter') status = Stat.Counter;
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
      if (statusString === 'armor' || statusString === 'armore') status = Stat.Armor;
      if (statusString === 'res' || statusString === 'resistance') status = Stat.DamageResistance;
      if (statusString === 'stealth') status = Stat.stealth;
      if (!status) return
      const statEffect: StatusEffect = {
        id: id,
        stat: status,
        value: Number.parseFloat(valueString),
      }
      statusEffects.push(statEffect);
      console.log('Effetc: ', { valueString, statusString });
    });
    return statusEffects;
  }
}
