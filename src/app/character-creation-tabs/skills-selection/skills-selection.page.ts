import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Character } from 'src/app/interfaces/character.interface';
import { CharacterCreationService } from 'src/app/services/character-creation.service';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { SkillTraits } from 'src/app/interfaces/skills-traits.interface';

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
        console.log('this.airtable.skillsTraits', this.airtable.skillsTraits);
        if (this.creation.skillTraitsSelection) {
          this.creation.skillsPoints -= this.creation.skillTraitsSelection.cost;
          console.log('Skill selected: ', this.creation.skillTraitsSelection);
          this.character.skillsId.push(this.creation.skillTraitsSelection.airtable_id);
          if (this.creation.skillTraitsSelection.type === 'trait') {
            this.creation.characterSelectedTraits.push(this.creation.skillTraitsSelection);
          } else {
            this.creation.characterSelectedSkills.push(this.creation.skillTraitsSelection);
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
      const creationIndex = this.creation.characterSelectedTraits.findIndex(a => a.airtable_id === id);
      if (creationIndex != -1) {
        const trait = this.creation.characterSelectedTraits[creationIndex];
        this.creation.skillsPoints += trait.cost;
        this.creation.characterSelectedTraits.splice(creationIndex, 1);
      }
    } else {
      const creationIndex = this.creation.characterSelectedSkills.findIndex(a => a.airtable_id === id);
      if (creationIndex != -1) {
        const skill = this.creation.characterSelectedSkills[creationIndex];
        this.creation.skillsPoints += skill.cost;
        this.creation.characterSelectedSkills.splice(creationIndex, 1);
      }
    }
    // remove from character's skills ID list
    const idIndex = this.character.skillsId.findIndex(a => a === id);
    if (idIndex != -1) this.character.skillsId.splice(idIndex, 1);

    this.creation.characterSubj.next(this.character);

  }

  isDependencyExist(skill: SkillTraits) {
    let dependency = false;
    if (skill.type === 'trait') {
      for (let index = 0; index < this.creation.characterSelectedTraits.length; index++) {
        const selected = this.creation.characterSelectedTraits[index];
        if (selected.prereq && selected.prereq.find(t => t.toLowerCase() === skill.title.toLowerCase())) {
          dependency = true;
          break;
        }
      }
    } else {
      for (let index = 0; index < this.creation.characterSelectedSkills.length; index++) {
        const selected = this.creation.characterSelectedSkills[index];
        if (selected.prereq && selected.prereq.find(t => t.toLowerCase() === skill.title.toLowerCase())) {
          dependency = true;
          break;
        }
      }
    }
    return dependency;
  }

}
