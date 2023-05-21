import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonAccordionGroup, IonContent } from '@ionic/angular';
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
  skillTypeFilter: string[];
  isSelectMode: boolean = false;
  backUrl: string = '/character-creation-tabs/skills-selection'
  backQuerySegmentSelection: string;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;
  constructor(
    public airtable: AirtableDataService,
    public creation: CharacterCreationService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    console.log('init called');
    this.airtable.$skillsTraits.subscribe((skillsTraits) => {
      console.log('skills inside subscribe');
      this.allSkills = skillsTraits;
      this.filterredSkills = skillsTraits;
      this.isLoading = false;
      if (this.skillTypeFilter && this.skillTypeFilter.length > 0) {
        this.onFilterChange();
      }
    })
    console.log('length', this.filterredSkills.length)
    if (this.filterredSkills.length < 1)
      this.airtable.loadDatabase();
    this.route.queryParams.subscribe((params) => {
      this.skillTypeFilter = [];
      console.log(params)
      if (params.isSelectMode)
        this.isSelectMode = true;
      if (params.segmentSelection) {
        console.log('params.segmentSelection', params.segmentSelection);
        this.backQuerySegmentSelection = params.segmentSelection;
        if(params.segmentSelection === 'traits') {
          this.skillTypeFilter.push('trait');
        } else if (params.segmentSelection === 'skills') {
          this.skillTypeFilter.push('skill');
        }
        this.onFilterChange();
      }
      if (params && params.breadcrumb) {
        this.backUrl = params.breadcrumb;
      }
    })
  }

  onFilterChange(event?) {
    this.isLoading = true;
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
    // FILTER ITEM TYPES
    const newTypeFilter: Array<SkillTraits> = [];
    if (this.skillTypeFilter) {
      this.skillTypeFilter.forEach(typeTxt => {
        console.log('typeTxt', typeTxt);
        this.filterredSkills.forEach(skill => {
          if (skill.type) {
            if (skill.type.toLowerCase().includes(typeTxt.toLowerCase())) {
              newTypeFilter.push(skill);
            }
          }
        });
      });
      if (newTypeFilter.length > 0) {
        this.filterredSkills = newTypeFilter;
      }
      console.log('typefilter:', newTypeFilter);
    }
    this.isLoading = false;
  }

  onSkillSelected(skill: SkillTraits) {
    this.creation.skillTraitsSelection = skill;
    this.router.navigate([this.backUrl], { queryParams: { selection: this.backQuerySegmentSelection, selected_id: skill.airtable_id } });
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
    if (selected) return selected;
    selected = this.creation.characterSelectedTraits.find(t => t.title === title);
    return selected
  }

  onGoToPrereq(prereq: string) {
    if (this.searchInput || this.skillTypeFilter && this.skillTypeFilter.length > 0) {
      this.searchInput = '';
      this.skillTypeFilter = [];
      // this.onFilterChange();
      setTimeout(() => {
        this.onGoToPrereq(prereq);
      }, 100);
    } else {
      if (this.accordionGroup.value === prereq) {
        this.accordionGroup.value = undefined;
      } else {
        this.accordionGroup.value = prereq;
        var scrollToElement = document.getElementById(prereq);
        if (scrollToElement)
          this.content.scrollToPoint(0, scrollToElement.offsetTop - 120, 1000);
      }

    }

  }

}
