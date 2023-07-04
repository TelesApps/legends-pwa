import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Character } from 'src/app/interfaces/character.interface';
import { CharacterCreationService } from 'src/app/services/character-creation.service';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { SkillTraits } from 'src/app/interfaces/skills-traits.interface';
import { EncylopediaService } from 'src/app/services/encylopedia.service';

@Component({
  selector: 'app-skills-selection',
  templateUrl: './skills-selection.page.html',
  styleUrls: ['./skills-selection.page.scss'],
})
export class SkillsSelectionPage implements OnInit {

  character: Character;
  segmentSelection = 'overview';

  constructor(
    public creation: CharacterCreationService,
    public encyclopedia: EncylopediaService,
    public airtable: AirtableDataService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const selection = params.selection;
      if (selection) {
        this.segmentSelection = params.selection;
      }
      this.creation.characterSubj.pipe(first()).subscribe((character) => {
        this.character = character;
        console.log('this.airtable.skillsTraits', this.airtable.$skillsTraits.getValue());
        if (this.creation.skillTraitsSelection) {
          this.creation.skillsPoints -= this.creation.skillTraitsSelection.cost;
          console.log('Skill selected: ', this.creation.skillTraitsSelection);
          this.character.skillsTraitsId.push(this.creation.skillTraitsSelection.airtable_id);
          if (this.creation.skillTraitsSelection.type === 'trait') {
            this.encyclopedia.characterSelectedTraits.push(this.creation.skillTraitsSelection);
          } else {
            this.encyclopedia.characterSelectedSkills.push(this.creation.skillTraitsSelection);
          }

          this.creation.skillTraitsSelection = undefined;
          this.creation.characterSubj.next(this.character);
        }
      })

    });
  }

  onSegmentChanged(event) {
    console.log(event);
  }

  onOpenSkills(selection: string) {
    this.router.navigate(['/encyclopedia-tabs/skills-traits-list'], {
      replaceUrl: true,
      queryParams: {
        breadcrumb: '/character-creation-tabs/skills-selection',
        isSelectMode: true,
        segmentSelection: selection
      }
    });
  }

  onRemoveSkill(id: string, type: string) {
    // Remove from list of creation.selected skills or traits
    if (type === 'trait') {
      const creationIndex = this.encyclopedia.characterSelectedTraits.findIndex(a => a.airtable_id === id);
      if (creationIndex != -1) {
        const trait = this.encyclopedia.characterSelectedTraits[creationIndex];
        this.creation.skillsPoints += trait.cost;
        this.encyclopedia.characterSelectedTraits.splice(creationIndex, 1);
      }
    } else {
      const creationIndex = this.encyclopedia.characterSelectedSkills.findIndex(a => a.airtable_id === id);
      if (creationIndex != -1) {
        const skill = this.encyclopedia.characterSelectedSkills[creationIndex];
        this.creation.skillsPoints += skill.cost;
        this.encyclopedia.characterSelectedSkills.splice(creationIndex, 1);
      }
    }
    // remove from character's skills ID list
    const idIndex = this.character.skillsTraitsId.findIndex(a => a === id);
    if (idIndex != -1) this.character.skillsTraitsId.splice(idIndex, 1);

    this.creation.characterSubj.next(this.character);

  }

  isDependencyExist(skill: SkillTraits) {
    let dependency = false;
    if (skill.type === 'trait') {
      for (let index = 0; index < this.encyclopedia.characterSelectedTraits.length; index++) {
        const selected = this.encyclopedia.characterSelectedTraits[index];
        if (selected.prereq && selected.prereq.find(t => t.toLowerCase() === skill.title.toLowerCase())) {
          dependency = true;
          break;
        }
      }
    } else {
      for (let index = 0; index < this.encyclopedia.characterSelectedSkills.length; index++) {
        const selected = this.encyclopedia.characterSelectedSkills[index];
        if (selected.prereq && selected.prereq.find(t => t.toLowerCase() === skill.title.toLowerCase())) {
          dependency = true;
          break;
        }
      }
    }
    return dependency;
  }

}
