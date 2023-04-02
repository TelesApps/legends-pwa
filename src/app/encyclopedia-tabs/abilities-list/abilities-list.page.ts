
import { Component, ContentChild, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonAccordionGroup, IonContent } from '@ionic/angular';
import { Ability } from 'src/app/interfaces/ability.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { CharacterCreationService } from 'src/app/services/character-creation.service';

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
  isSelectMode: boolean = false;
  remainingAP: number = 0;
  backUrl: string = '/character-creation-tabs/abilities-selection'
  errorMessage = '';
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;
  constructor(
    public airtable: AirtableDataService,
    private route: ActivatedRoute,
    public creation: CharacterCreationService,
    private router: Router) { }

  ngOnInit() {
    console.log('abilities init');
    this.airtable.$abilities.subscribe((abilities) => {
      this.allAbilities = abilities;
      this.filteredAbilities = abilities;
      this.isLoading = false;
      console.log('all abilities', abilities);
      this.route.queryParams.subscribe((params) => {
        console.log(params)
        if (params.isSelectMode)
          this.isSelectMode = true;
        if (params && params.breadcrumb) {
          this.backUrl = params.breadcrumb;
        }
      })
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.error.message
    })
    if (this.filteredAbilities.length < 1)
      this.airtable.loadAbilities();
  }

  onFilterChange(event?) {
    //console.log(event.detail.value);
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

  onGoToPrereq(prereq: string) {
    if (this.searchInput || this.tagFilterTxt && this.tagFilterTxt.length > 0) {
      this.searchInput = '';
      this.tagFilterTxt = [];
      this.onFilterChange();
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

  isPrereqMet(ability: Ability) {
    let prereqMet = true;
    if (ability.prereq) {
      ability.prereq.forEach(requiredTitle => {
        const title = this.hasAbility(requiredTitle);
        if (!title)
          prereqMet = false
      });
    }
    return prereqMet;
  }

  hasAbility(title: string) {
    return this.creation.characterSelectedAbilities.find(t => t.title === title);
  }

  onAbilitySelected(ability: Ability) {
    this.creation.abilitySelection = ability;
    this.router.navigate([this.backUrl]);
    console.log('ability selected: ', ability)
    this.accordionGroup.value = undefined;
  }
}


