import { Component, OnInit } from '@angular/core';
import { SkillTraits } from 'src/app/interfaces/skills-traits.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';

@Component({
  selector: 'app-skills-traits-list',
  templateUrl: './skills-traits-list.page.html',
  styleUrls: ['./skills-traits-list.page.scss'],
})
export class SkillsTraitsListPage implements OnInit {

  isLoading: boolean = true;
  filterredSkills: Array<SkillTraits> = [];
  allSkills = [];
  searchInput: string;
  skillTagFilter: string[];
  constructor(public airtable: AirtableDataService) { }

  ngOnInit() {
    console.log('skills and traits init');
    this.airtable.$skillsTraits.subscribe((skillsTraits) => {
      this.allSkills = skillsTraits;
      this.filterredSkills = skillsTraits;
      this.isLoading = false;
    })
    if (this.filterredSkills.length < 1)
      this.airtable.loadSkillsAndTraits();
  }

  onFilterChange(event) {
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
    console.log('item type filter: ', this.skillTagFilter);
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

}
