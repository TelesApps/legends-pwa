import { Injectable } from '@angular/core';
import { Character } from '../interfaces/character.interface';
import { Stat, StatusEffect } from '../interfaces/status-effect.interface';

@Injectable({
  providedIn: 'root'
})
export class CalculationsService {

  constructor() { }

  calculateEffectsFromStrings(effects: string[], id?: string) {
    const statusEffects: StatusEffect[] = [];
    effects.forEach(effect => {
      let valueString = effect.match(/-?\d+/g)[0];
      let statusString = effect.match(/[a-zA-Z]+/g)[0].toLowerCase();
      let status: Stat;
      if (statusString === 'h' || statusString === 'health')  status = Stat.Health;
      if (statusString === 'stam' || statusString === 'stamina')  status = Stat.Stamina;
      if (statusString === 'p' || statusString === 'power')  status = Stat.Power;
      if (statusString === 'ra' || statusString === 'rangedattack')  status = Stat.RangeAttack;
      if (statusString === 'a' || statusString === 'attack') status = Stat.MeleeAttack;
      if (statusString === 'ma' || statusString === 'meleeattack')  status = Stat.MeleeAttack;
      if (statusString === 'dmg' || statusString === 'damage') status = Stat.DamageDelt;
      if (statusString === 'd' || statusString === 'defence') status = Stat.Defence;
      if (statusString === 'str' || statusString === 'strength')  status = Stat.Strength;
      if (statusString === 'ag' || statusString === 'agility')  status = Stat.Agility;
      if (statusString === 'acc' || statusString === 'accuracy')  status = Stat.Accuracy;
      if (statusString === 'per' || statusString === 'perc' || statusString === 'perception') status = Stat.Perception;
      if (statusString === 'm' || statusString === 'mental') status = Stat.Mental;
      if (statusString === 'mov' || statusString === 'movement') status = Stat.Movement;
      if (statusString === 'crit') status = Stat.Crit;
      if (statusString === 'armor' || statusString === 'armore') status = Stat.Armor;
      if (statusString === 'res' || statusString === 'resistance') status = Stat.DamageResistance;
      if (statusString === 'stealth') status = Stat.stealth;

        const statEffect: StatusEffect = {
          id: id,
          stat: status,
          value: Number.parseFloat(valueString),
        }
      console.log('Effetc: ', { valueString, statusString });
    });
  }
}
