import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Ability } from 'src/app/interfaces/ability.interface';
import { Character } from 'src/app/interfaces/character.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { CharactersService } from 'src/app/services/characters.service';
import { EncylopediaService } from 'src/app/services/encylopedia.service';

@Component({
  selector: 'app-abilities',
  templateUrl: './abilities.page.html',
  styleUrls: ['./abilities.page.scss'],
})
export class AbilitiesPage implements OnInit, OnDestroy {

  foundations: Array<Ability> = [];
  abilities: Array<Ability> = [];
  isEditing = false;
  characterSubscription: Subscription;

  constructor(
    private characterServ: CharactersService,
    private encyclopedia: EncylopediaService,
    private activeRoute: ActivatedRoute,
    private airtable: AirtableDataService,
    private router: Router) { }

  ngOnInit() {
    this.airtable.loadDatabase();
    // Populate selected abilities list for foundations and nonefoundations based on previous selections
    this.encyclopedia.characterSelectedAbilities.forEach(ability => {
      if (ability && ability.isFoundation) {
        this.foundations.push(ability);
      } else {
        this.abilities.push(ability);
      }
    });

    this.characterSubscription = this.characterServ.selectedCharacters.subscribe((characters) => {
      const character = characters[this.characterServ.viewIndex];
      this.setCharacterAbilities(character);
    });
    this.activeRoute.queryParams.pipe(first()).subscribe((params) => {
      console.log('params: ', params);
      if (params.selected_id) {
        this.onAbilitySelected(params.selected_id);
      }
    });
  }

  setCharacterAbilities(character: Character) {
    this.foundations = [];
    this.abilities = [];
    if (character && character.abilitiesId && character.abilitiesId.length > 0) {
      this.airtable.isLoadDataComplete.subscribe((isLoaded) => {
        character.abilitiesId.forEach((id) => {
          const ability = this.airtable.getAbilityById(id);
          if (ability && ability.isFoundation) {
            this.foundations.push(ability);
            console.log('adding ability', ability)
          } else {
            this.abilities.push(ability)
            console.log('adding ability', ability)
          }
        });
      });
    }
    this.encyclopedia.characterSelectedAbilities = this.foundations;
    this.encyclopedia.characterSelectedAbilities = this.encyclopedia.characterSelectedAbilities.concat(this.abilities);
  }

  onOpenAbilitiesList() {
    this.encyclopedia.characterSelectedAbilities = this.foundations;
    this.encyclopedia.characterSelectedAbilities = this.encyclopedia.characterSelectedAbilities.concat(this.abilities);
    this.router.navigate(['/encyclopedia-tabs/abilities-list'], {
      replaceUrl: true,
      queryParams: {
        breadcrumb: '/character-tabs/abilities',
        isSelectMode: true,
      }
    });
  }

  onAbilitySelected(id: string) {
    const ability = this.airtable.getAbilityById(id);
    console.log(ability);
    if (ability) {
      if (ability.isFoundation) {
        if (this.foundations.find(t => t.airtable_id === id) === undefined) {
          this.foundations.push(ability);
          const characters = this.characterServ.selectedCharacters.getValue();
          characters[this.characterServ.viewIndex].abilitiesId.push(id);
          this.characterServ.selectedCharacters.next(characters);
        }
      } else {
        if (this.abilities.find(t => t.airtable_id === id) === undefined) {
          this.abilities.push(ability);
          const characters = this.characterServ.selectedCharacters.getValue();
          characters[this.characterServ.viewIndex].abilitiesId.push(id);
          this.characterServ.selectedCharacters.next(characters);
        }
      }
    }
  }

  onRemoveAbility(id: string) {
    // // Remove ability from local foundation and nonefoundation list
    let index = this.foundations.findIndex(a => a.airtable_id === id);
    if (index != -1) {
      this.foundations.splice(index, 1)
    }
    else {
      index = this.abilities.findIndex(a => a.airtable_id === id)
      if (index != -1) this.abilities.splice(index, 1)
    }
    // Remove from list of creation.selected abilities
    const abilityIndex = this.encyclopedia.characterSelectedAbilities.findIndex(a => a.airtable_id === id);
    if (abilityIndex != -1) {
      this.encyclopedia.characterSelectedAbilities.splice(abilityIndex, 1);
    }
    // remove from character's abilities ID list
    const characters = this.characterServ.selectedCharacters.getValue();
    const idIndex = characters[this.characterServ.viewIndex].abilitiesId.findIndex(a => a === id);
    if (idIndex != -1) characters[this.characterServ.viewIndex].abilitiesId.splice(idIndex, 1);
    this.characterServ.selectedCharacters.next(characters);
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

  ngOnDestroy() {
    this.characterSubscription.unsubscribe();
  }

}
