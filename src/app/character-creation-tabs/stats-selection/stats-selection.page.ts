import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/interfaces/character.interface';
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
    if(this.creation.statsPoints > 0 || value < 0) {
      value > 0 ? this.creation.statsPoints-- : this.creation.statsPoints++;
      switch (stat) {
        case 'H': this.character.primaryStats.maxHealth += (value * 3); break;
        case 'Stam': this.character.primaryStats.maxStamina += (value * 5); break;
        case 'P': this.character.primaryStats.maxStamina += (value * 5); break;
        case 'Str': this.character.primaryStats.core_strength += value; break;
        case 'Ag': this.character.primaryStats.core_agility += value; break;
        case 'Acc': this.character.primaryStats.core_accuracy += value; break;
        case 'Per': this.character.primaryStats.core_perception += value; break;
        case 'M': this.character.primaryStats.core_mental += value; break;
      }
      this.creation.characterSubj.next(this.character);
    }
  }

}
