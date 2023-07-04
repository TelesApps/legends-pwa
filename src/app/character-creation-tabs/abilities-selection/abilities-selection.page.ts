import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CharacterCreationService } from 'src/app/services/character-creation.service';
import { first } from 'rxjs/operators';
import { Character } from 'src/app/interfaces/character.interface';
import { Ability } from 'src/app/interfaces/ability.interface';
import { EncylopediaService } from 'src/app/services/encylopedia.service';


@Component({
  selector: 'app-abilities-selection',
  templateUrl: './abilities-selection.page.html',
  styleUrls: ['./abilities-selection.page.scss'],
})
export class AbilitiesSelectionPage implements OnInit {

  character: Character;
  selectedFoundations: Array<Ability> = [];
  noneFoundations: Array<Ability> = [];
  constructor(private router: Router, public creation: CharacterCreationService, public encyclopedia: EncylopediaService) { }

  ngOnInit() {
    // Populate selected abilities list for foundations and nonefoundations based on previous selections
    this.encyclopedia.characterSelectedAbilities.forEach(ability => {
      if (ability.tags && ability.tags.length > 0 && ability.tags[0].toLowerCase() === 'foundation') {
        this.selectedFoundations.push(ability);
      } else {
        this.noneFoundations.push(ability);
      }
    });
    this.creation.characterSubj.pipe(first()).subscribe((character) => {
      console.log('characterSelectedAbilities: ', this.encyclopedia.characterSelectedAbilities);
      this.character = character;
      if (this.creation.abilitySelection) {
        this.creation.abilityPoints -= this.creation.abilitySelection.points_req;
        console.log('ability selected: ', this.creation.abilitySelection);
        this.character.abilitiesId.push(this.creation.abilitySelection.airtable_id);
        // Add title to abilitiesTitle so that encyclopedia knows the prereqs character has.
        this.encyclopedia.characterSelectedAbilities.push(this.creation.abilitySelection);
        if (this.creation.abilitySelection.tags && this.creation.abilitySelection.tags.length > 0 &&
          this.creation.abilitySelection.tags[0].toLowerCase() === 'foundation') {
          this.selectedFoundations.push(this.creation.abilitySelection);
        } else {
          this.noneFoundations.push(this.creation.abilitySelection)
        }
        this.creation.abilitySelection = undefined;
        this.creation.characterSubj.next(this.character);
      }
    });
  }

  onOpenAbilitiesList() {
    this.router.navigate(['/encyclopedia-tabs/abilities-list'], {
      replaceUrl: true,
      queryParams: {
        breadcrumb: '/character-creation-tabs/abilities-selection',
        isSelectMode: true,
      }
    });
  }

  onRemoveAbility(id: string) {
    // Remove ability from local foundation and nonefoundation list
    let index = this.selectedFoundations.findIndex(a => a.airtable_id === id);
    if (index != -1) {
      this.selectedFoundations.splice(index, 1)
    }
    else {
      index = this.noneFoundations.findIndex(a => a.airtable_id === id)
      if (index != -1) this.noneFoundations.splice(index, 1)
    }
    // Remove from list of creation.selected abilities
    const creationIndex = this.encyclopedia.characterSelectedAbilities.findIndex(a => a.airtable_id === id);
    if (creationIndex != -1)  {
      const ability = this.encyclopedia.characterSelectedAbilities[creationIndex];
      this.creation.abilityPoints += ability.points_req;
      this.encyclopedia.characterSelectedAbilities.splice(creationIndex, 1);
    }
    // remove from character's abilities ID list
    const idIndex = this.character.abilitiesId.findIndex(a => a === id);
    if (idIndex != -1) this.character.abilitiesId.splice(idIndex, 1);

    this.creation.characterSubj.next(this.character);

  }

  isDependencyExist(ability: Ability) {
    let dependency = false;
    for (let index = 0; index < this.encyclopedia.characterSelectedAbilities.length; index++) {
      const selected = this.encyclopedia.characterSelectedAbilities[index];
      if (selected.prereq && selected.prereq.find(t => t.toLowerCase() === ability.title.toLowerCase())) {
        dependency = true;
        break;
      }
    }
    return dependency;
  }

}
