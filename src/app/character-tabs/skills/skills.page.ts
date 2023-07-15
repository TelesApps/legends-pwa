import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { SkillTraits } from 'src/app/interfaces/skills-traits.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { CharactersService } from 'src/app/services/characters.service';
import { EncylopediaService } from 'src/app/services/encylopedia.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.page.html',
  styleUrls: ['./skills.page.scss'],
})
export class SkillsPage implements OnInit, OnDestroy {

  segmentSelection = 'traits';
  characterSkills: SkillTraits[] = [];
  characterTraits: SkillTraits[] = [];
  characterSubscription: Subscription;
  isEditing = false;
  constructor(
    public characterServ: CharactersService,
    public airtable: AirtableDataService,
    private encyclopedia: EncylopediaService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private tabs: IonTabs) { }

  ngOnInit() {
    this.airtable.loadDatabase();
    this.characterSubscription = this.characterServ.selectedCharacters.subscribe((characters) => {
      const character = characters[this.characterServ.viewIndex];
      this.getCharacterSkillTraits(character);
    });
    this.activeRoute.queryParams.pipe(take(1)).subscribe((params) => {
      if (params.selection) {
        this.segmentSelection = params.selection;
      }
      console.log('params: ', params);
      if (params.selected_id) {
        this.onSkillTraitSelected(params.selected_id);
      }
    });
    this.tabs.ionTabsDidChange.subscribe((event) => {
      this.isEditing = false;
    });
  }

  onSegmentChanged(event) {
    this.isEditing = false;
  }

  getCharacterSkillTraits(character) {
    this.characterSkills = [];
    this.characterTraits = [];
    if (character && character.skillsTraitsId && character.skillsTraitsId.length > 0) {
      this.airtable.isLoadDataComplete.pipe(take(1)).subscribe((isLoaded) => {
        character.skillsTraitsId.forEach((id) => {
          const skillTrait = this.airtable.getSkillTraitById(id);
          if (skillTrait && skillTrait.type === 'trait') {
            this.characterTraits.push(skillTrait);
          } else {
            this.characterSkills.push(skillTrait);
          }
        });
      });
    }
  }

  onOpenSkills(selection: string) {
    this.encyclopedia.characterSelectedSkills = this.characterSkills;
    this.encyclopedia.characterSelectedTraits = this.characterTraits;
    this.router.navigate(['/encyclopedia-tabs/skills-traits-list'], {
      replaceUrl: true,
      queryParams: {
        breadcrumb: '/character-tabs/skills',
        isSelectMode: true,
        segmentSelection: selection,
      }
    });
  }

  onSkillTraitSelected(id) {
    const skillTrait = this.airtable.getSkillTraitById(id);
    if (skillTrait) {
      if (skillTrait.type === 'trait') {
        if (this.characterTraits.find(t => t.airtable_id === id) === undefined) {
          this.characterTraits.push(skillTrait);
          const characters = this.characterServ.selectedCharacters.getValue();
          characters[this.characterServ.viewIndex].skillsTraitsId.push(id);
          this.characterServ.selectedCharacters.next(characters);
        }
      } else {
        if (this.characterSkills.find(t => t.airtable_id === id) === undefined) {
          this.characterSkills.push(skillTrait);
          const characters = this.characterServ.selectedCharacters.getValue();
          characters[this.characterServ.viewIndex].skillsTraitsId.push(id);
          this.characterServ.selectedCharacters.next(characters);
        }
      }
    }
  }

  onRemoveSkill(id: string, type: string) {
    // Remove from list of creation.selected skills or traits
    if (type === 'trait') {
      const index = this.characterTraits.findIndex(a => a.airtable_id === id);
      if (index != -1) {
        const trait = this.encyclopedia.characterSelectedTraits[index];
        this.encyclopedia.characterSelectedTraits.splice(index, 1);
      }
    } else {
      const creationIndex = this.characterSkills.findIndex(a => a.airtable_id === id);
      if (creationIndex != -1) {
        const skill = this.characterSkills[creationIndex];
        this.characterSkills.splice(creationIndex, 1);
      }
    }
    // remove from character's skills ID list
    const characters = this.characterServ.selectedCharacters.getValue();
    const idIndex = characters[this.characterServ.viewIndex].skillsTraitsId.findIndex(a => a === id);
    if (idIndex != -1) characters[this.characterServ.viewIndex].skillsTraitsId.splice(idIndex, 1);
    this.characterServ.selectedCharacters.next(characters);

  }

  isDependencyExist(skill: SkillTraits) {
    let dependency = false;
    if (skill.type === 'trait') {
      for (let index = 0; index < this.characterTraits.length; index++) {
        const selected = this.characterTraits[index];
        if (selected.prereq && selected.prereq.find(t => t.toLowerCase() === skill.title.toLowerCase())) {
          dependency = true;
          break;
        }
      }
    } else {
      for (let index = 0; index < this.characterSkills.length; index++) {
        const selected = this.characterSkills[index];
        if (selected.prereq && selected.prereq.find(t => t.toLowerCase() === skill.title.toLowerCase())) {
          dependency = true;
          break;
        }
      }
    }
    return dependency;
  }

  ngOnDestroy() {
    if (this.characterSubscription)
      this.characterSubscription.unsubscribe();
  }

}
