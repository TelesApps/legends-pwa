import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Character } from 'src/app/interfaces/character.interface';
import { CharacterCreationService } from 'src/app/services/character-creation.service';
import { AirtableDataService } from 'src/app/services/airtable-data.service';

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
          // #TODO
          // Add logic here to add this selected skillTrait to either the this.creation.characterSelectedSkills
          // or the this.creation.characterSelectedTraits Array.
          // In Airtable Create a column for "Type" where we define if its a trait or Skill.

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

}
