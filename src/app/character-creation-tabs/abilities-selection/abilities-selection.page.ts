import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CharacterCreationService } from 'src/app/services/character-creation.service';
import { first } from 'rxjs/operators';
import { Character } from 'src/app/interfaces/character.interface';


@Component({
  selector: 'app-abilities-selection',
  templateUrl: './abilities-selection.page.html',
  styleUrls: ['./abilities-selection.page.scss'],
})
export class AbilitiesSelectionPage implements OnInit {

  character: Character;
  constructor(private router: Router, public creation: CharacterCreationService) { }

  ngOnInit() {
    this.creation.characterSubj.pipe(first()).subscribe((character) => {
      console.log('characterSelectedAbilities: ', this.creation.characterSelectedAbilities);
      this.character = character;
      if (this.creation.abilitySelection) {
        console.log('ability selected: ', this.creation.abilitySelection);
        this.character.abilitiesId.push(this.creation.abilitySelection.airtable_id);
        // Add title to abilitiesTitle so that encyclopedia knows the prereqs character has.
        this.creation.characterSelectedAbilities.push(this.creation.abilitySelection);
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

}
