import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private airtable: AirtableDataService) { }

  ngOnInit() {
    this.airtable.loadDatabase();
    // Populate selected abilities list for foundations and nonefoundations based on previous selections
    // this.encyclopedia.characterSelectedAbilities.forEach(ability => {
    //   if (ability.tags && ability.tags.length > 0 && ability.tags[0].toLowerCase() === 'foundation') {
    //     this.foundations.push(ability);
    //   } else {
    //     this.abilities.push(ability);
    //   }
    // });

    this.activeRoute.queryParams.pipe(first()).subscribe((params) => {
      console.log('params: ', params);
      if (params.selected_id) {
        this.onAbilitySelected(params.selected_id);
      }
    });

    this.characterSubscription = this.characterServ.selectedCharacters.subscribe((characters) => {
      const character = characters[this.characterServ.viewIndex];
      this.setCharacterAbilities(character);
      // if (this.isEditing) {
      //   this.character.abilitiesId.push(this.creation.abilitySelection.airtable_id);
      //   // Add title to abilitiesTitle so that encyclopedia knows the prereqs character has.
      //   this.encyclopedia.characterSelectedAbilities.push(this.creation.abilitySelection);
      //   if (this.creation.abilitySelection.tags && this.creation.abilitySelection.tags.length > 0 &&
      //     this.creation.abilitySelection.tags[0].toLowerCase() === 'foundation') {
      //     this.foundations.push(this.creation.abilitySelection);
      //   } else {
      //     this.abilities.push(this.creation.abilitySelection)
      //   }
      //   this.creation.abilitySelection = undefined;
      //   this.creation.characterSubj.next(this.character);
      // }
    });
  }

  setCharacterAbilities(character: Character) {
    this.foundations = [];
    this.abilities = [];
    if (character && character.abilitiesId && character.abilitiesId.length > 0) {
      this.airtable.isLoadDataComplete.subscribe((isLoaded) => {
        character.abilitiesId.forEach((id) => {
          const ability = this.airtable.getAbilityById(id);
          if (ability && ability.tags && ability.tags.length > 0 && ability.tags[0].toLowerCase() === 'foundation') {
            this.foundations.push(ability);
          } else {
            this.abilities.push(ability)
          }
        });
      });
    }
  }

  onOpenAbilitiesList() {
    // this.router.navigate(['/encyclopedia-tabs/abilities-list'], {
    //   replaceUrl: true,
    //   queryParams: {
    //     breadcrumb: '/character-creation-tabs/abilities-selection',
    //     isSelectMode: true,
    //   }
    // });
  }

  onAbilitySelected(id: string) {

  }

  onRemoveAbility(id: string) {
    // // Remove ability from local foundation and nonefoundation list
    // let index = this.foundations.findIndex(a => a.airtable_id === id);
    // if (index != -1) {
    //   this.foundations.splice(index, 1)
    // }
    // else {
    //   index = this.abilities.findIndex(a => a.airtable_id === id)
    //   if (index != -1) this.abilities.splice(index, 1)
    // }
    // // Remove from list of creation.selected abilities
    // const creationIndex = this.encyclopedia.characterSelectedAbilities.findIndex(a => a.airtable_id === id);
    // if (creationIndex != -1) {
    //   const ability = this.encyclopedia.characterSelectedAbilities[creationIndex];
    //   this.creation.abilityPoints += ability.points_req;
    //   this.encyclopedia.characterSelectedAbilities.splice(creationIndex, 1);
    // }
    // // remove from character's abilities ID list
    // const idIndex = this.character.abilitiesId.findIndex(a => a === id);
    // if (idIndex != -1) this.character.abilitiesId.splice(idIndex, 1);

    // this.creation.characterSubj.next(this.character);

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
