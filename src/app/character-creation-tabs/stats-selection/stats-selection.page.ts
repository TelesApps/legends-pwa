import { Component, OnInit } from '@angular/core';
import { Character, CreateNewCharacter } from 'src/app/interfaces/character.interface';
import { CharacterCreationService } from 'src/app/services/character-creation.service';
import { Stat, StatusEffect } from '../../interfaces/status-effect.interface'

@Component({
  selector: 'app-stats-selection',
  templateUrl: './stats-selection.page.html',
  styleUrls: ['./stats-selection.page.scss'],
})
export class StatsSelectionPage implements OnInit {

  character: Character
  constructor(public creation: CharacterCreationService) { }

  ngOnInit() {
    this.creation.characterSubj.subscribe((character) => this.character = character);
  }

  onStatChange(stat: string, value: number) {
    const initialStats: Character = CreateNewCharacter();
    let newStat;
    switch (stat) {
      case 'Stam':
        newStat = this.getNewStatNumber(this.character.primaryStats.maxStamina, value, initialStats.primaryStats.maxStamina, 5);
        if (newStat)
          this.character.primaryStats.maxStamina = newStat;
        break;
      case 'P':
        newStat = this.getNewStatNumber(this.character.primaryStats.maxPower, value, initialStats.primaryStats.maxPower, 5);
        if (newStat)
          this.character.primaryStats.maxPower = newStat;
        break;
      case 'Str':
        newStat = this.getNewStatNumber(this.character.primaryStats.core_strength, value, initialStats.primaryStats.core_strength, 1);
        if (newStat)
          this.character.primaryStats.core_strength = newStat;
        break;
      case 'Ag':
        newStat = this.getNewStatNumber(this.character.primaryStats.core_agility, value, initialStats.primaryStats.core_agility, 1);
        if (newStat)
          this.character.primaryStats.core_agility = newStat;
        break;
      case 'Acc':
        newStat = this.getNewStatNumber(this.character.primaryStats.core_accuracy, value, initialStats.primaryStats.core_accuracy, 1);
        if (newStat)
          this.character.primaryStats.core_accuracy = newStat;
        break;
      case 'Per':
        newStat = this.getNewStatNumber(this.character.primaryStats.core_perception, value, initialStats.primaryStats.core_perception, 1);
        if (newStat)
          this.character.primaryStats.core_perception = newStat;
        break;
      case 'M':
        newStat = this.getNewStatNumber(this.character.primaryStats.core_mental, value, initialStats.primaryStats.core_mental, 1);
        if (newStat)
          this.character.primaryStats.core_mental = newStat;
        break;
    }
    this.creation.characterSubj.next(this.character);

  }

  getNewStatNumber(statToChange: number, value: number, minimumValue: number, multiplier = 1) {
    if (statToChange + (value * multiplier) < minimumValue) { console.log('less then minimum, ', value); return undefined }
    else {
      console.log('value: ', value);
      if (this.creation.statsPoints > 0 || value < 0) {
        value > 0 ? this.creation.statsPoints-- : this.creation.statsPoints++;
        statToChange += (value * multiplier);
        console.log(statToChange);
        return statToChange;
      } else return undefined;
    }
  }

}
