
import { Component, OnInit } from '@angular/core';
import { Ability } from 'src/app/interfaces/ability.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';

@Component({
  selector: 'app-abilities-list',
  templateUrl: './abilities-list.page.html',
  styleUrls: ['./abilities-list.page.scss', '../encyclopedia-tabs.page.scss'],
})
export class AbilitiesListPage implements OnInit {

  allAbilities: Ability[] = [];
  filteredAbilities: Array<Ability> = [];
  isLoading = true;
  searchInput: string;
  tagFilterTxt: string[];
  constructor(public airtable: AirtableDataService) { }

  ngOnInit() {
    console.log('abilities init');
    this.airtable.$abilities.subscribe((abilities) => {
      this.allAbilities = abilities;
      this.filteredAbilities = abilities;
      this.isLoading = false;
      console.log('all abilities', abilities);
    })
    if (this.filteredAbilities.length < 1)
      this.airtable.loadAbilities();
  }

  onFilterChange(event) {
    console.log(event.detail.value);
    this.filteredAbilities = this.allAbilities
    if (this.searchInput) {
      let userWord1 = this.searchInput;
      let userWord2;
      if (this.searchInput.indexOf(' ') >= 0) {
        userWord1 = this.searchInput.substring(0, this.searchInput.indexOf(' '))
        userWord2 = this.searchInput.substring((this.searchInput.indexOf(' ') + 1));
      }
      const newSearchFilter: Array<Ability> = [];
      this.allAbilities.forEach(item => {
        if (item.title.toLowerCase().includes(userWord1.toLowerCase()) || userWord2 && item.title.toLowerCase().includes(userWord2.toLowerCase())) {
          newSearchFilter.push(item);
          if (newSearchFilter.length > 0) {
            this.filteredAbilities = newSearchFilter;
          }
        }
      });
    }
    // FILTER BY TAGS
    console.log('item type filter: ', this.tagFilterTxt);
    const newTagFilter: Array<Ability> = [];
    if (this.tagFilterTxt) {
      this.tagFilterTxt.forEach(tagTxt => {
        console.log(tagTxt);
        this.filteredAbilities.forEach(ability => {
          if (ability.tags) {
            ability.tags.forEach(tag => {
              if (tag && tag.toLowerCase().includes(tagTxt.toLowerCase())) {
                newTagFilter.push(ability);
              }
            });
          }
        });
      });
      if (newTagFilter.length > 0) {
        this.filteredAbilities = newTagFilter;
      }
      console.log('typefilter:', newTagFilter);
    }

    // FILTER BODY_PROPERTY
    // const newBodyPropertyFilter: Array<Item> = [];
    // if (this.bodyPropertyFilter) {
    //   this.bodyPropertyFilter.forEach(property => {
    //     this.filteredAbilities.forEach(item => {
    //       if (item.body_property && item.body_property.toLowerCase().includes(property.toLowerCase())) {
    //         newBodyPropertyFilter.push(item);
    //       }
    //     });
    //   });
    //   if (newBodyPropertyFilter.length > 0) {
    //     this.filteredAbilities = newBodyPropertyFilter;
    //   }
    //   console.log('property filter:', newBodyPropertyFilter);
    // }
  }

}
