import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonAccordionGroup } from '@ionic/angular';
import { SkillTraits } from 'src/app/interfaces/skills-traits.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { CharacterCreationService } from 'src/app/services/character-creation.service';

@Component({
  selector: 'app-skills-traits-list',
  templateUrl: './skills-traits-list.page.html',
  styleUrls: ['../encyclopedia-tabs.page.scss', './skills-traits-list.page.scss'],
})
export class SkillsTraitsListPage implements OnInit {

  isLoading: boolean = true;
  filterredSkills: Array<SkillTraits> = [];
  allSkills = [];
  searchInput: string;
  skillTagFilter: string[];
  isSelectMode: boolean = false;
  backUrl: string = '/character-creation-tabs/skills-selection'
  backQuerySegmentSelection: string;
  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;
  constructor(
    public airtable: AirtableDataService,
    public creation: CharacterCreationService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.airtable.$skillsTraits.subscribe((skillsTraits) => {
      console.log('skills inside subscribe');
      this.allSkills = skillsTraits;
      this.filterredSkills = skillsTraits;
      this.isLoading = false;
    })
    console.log('length', this.filterredSkills.length)
    if (this.filterredSkills.length < 1)
      this.airtable.loadSkillsAndTraits();
    this.route.queryParams.subscribe((params) => {
      console.log(params)
      if (params.isSelectMode)
        this.isSelectMode = true;
      if (params.segmentSelection) {
        console.log('params.segmentSelection', params.segmentSelection);
        this.backQuerySegmentSelection = params.segmentSelection;
      }
      if (params && params.breadcrumb) {
        this.backUrl = params.breadcrumb;
      }
    })
  }

  onFilterChange(event) {
    // #TODO
    // ADD Logic to filter by Trait or by Skill
    this.isLoading = true;
    console.log(event.detail.value);
    this.filterredSkills = this.allSkills
    if (this.searchInput) {
      let userWord1 = this.searchInput;
      let userWord2;
      if (this.searchInput.indexOf(' ') >= 0) {
        userWord1 = this.searchInput.substring(0, this.searchInput.indexOf(' '))
        userWord2 = this.searchInput.substring((this.searchInput.indexOf(' ') + 1));
      }
      const newSearchFilter: Array<SkillTraits> = [];
      this.allSkills.forEach(skillTrait => {
        if (skillTrait.title.toLowerCase().includes(userWord1.toLowerCase()) ||
          userWord2 && skillTrait.title.toLowerCase().includes(userWord2.toLowerCase())) {
          newSearchFilter.push(skillTrait);
          if (newSearchFilter.length > 0) {
            this.filterredSkills = newSearchFilter;
          }
        }
      });
    }
    // FILTER ITEM TAGS
    const newTagFilter: Array<SkillTraits> = [];
    if (this.skillTagFilter) {
      this.skillTagFilter.forEach(tagTxt => {
        console.log(tagTxt);
        this.filterredSkills.forEach(skill => {
          if (skill.tags) {
            skill.tags.forEach(tag => {
              if (tag && tag.toLowerCase().includes(tagTxt.toLowerCase())) {
                newTagFilter.push(skill);
              }
            });
          }
        });
      });
      if (newTagFilter.length > 0) {
        this.filterredSkills = newTagFilter;
      }
      console.log('typefilter:', newTagFilter);
    }
    this.isLoading = false;
  }

  onSkillSelected(skill: SkillTraits) {
    this.creation.skillTraitsSelection = skill;
    this.router.navigate([this.backUrl], {queryParams: {selection: this.backQuerySegmentSelection}});
    console.log('Skill&Traits selected: ', skill)
    this.accordionGroup.value = undefined;
  }

  hasEnoughPoints(cost: number) {
    return cost <= this.creation.skillsPoints;
  }

  isPrereqMet(skill: SkillTraits) {
    let prereqMet = true;
    if (skill.prereq) {
      skill.prereq.forEach(requiredTitle => {
        const title = this.hasSkill(requiredTitle);
        if (!title)
          prereqMet = false
      });
    }
    return prereqMet;
  }
  hasSkill(title: string) {
    let selected;
    selected = this.creation.characterSelectedSkills.find(t => t.title === title);
    if(selected) return selected;
    selected = this.creation.characterSelectedTraits.find(t => t.title === title);
    return selected
  }

}
