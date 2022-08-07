import { AfterContentChecked, AfterContentInit, ChangeDetectorRef, Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonAccordionGroup } from '@ionic/angular';
import { isEmpty } from 'rxjs/operators';
import { Item } from 'src/app/interfaces/item.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';
import { CharacterCreationService } from 'src/app/services/character-creation.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['../encyclopedia-tabs.page.scss', './items-list.page.scss'],
})
export class ItemsListPage implements OnInit {

  isSelectType: string = '';
  public allItems: Array<Item> = [];
  public filterredItems: Array<Item> = [];
  searchInput: string;
  itemTypeFilter: string[];
  bodyPropertyFilter: string[];
  isLoading = true;
  backUrl: string = '/character-creation-tabs/equipment-selection'
  @ViewChild('accordionGroup', { static: true }) accordionGroup: IonAccordionGroup;

  constructor(
    public airtable: AirtableDataService,
    private route: ActivatedRoute,
    private router: Router,
    private creation: CharacterCreationService
  ) {
  }

  ngOnInit() {
    this.airtable.$allItems.subscribe((all_items) => {
      this.allItems = all_items;
      this.filterredItems = this.allItems;
      this.route.queryParams.subscribe((params) => {
        console.log('params: ', params);
        if (params && params.itemType) {
          this.itemTypeFilter = [];
          this.itemTypeFilter.push(params.itemType);
        }
        if (params && params.bodyProperty) {
          this.bodyPropertyFilter = [];
          if(params.hand === 'backpack') {
            this.bodyPropertyFilter.push('equipment');
          } else if(params.hand) {
            this.bodyPropertyFilter.push('weapon');
            this.bodyPropertyFilter.push('shield');
          } else {
            this.bodyPropertyFilter.push(params.bodyProperty);
          }
        }
        if(params && params.breadcrumb) {
          this.backUrl = params.breadcrumb;
        }
        if (this.itemTypeFilter && this.itemTypeFilter.length > 0 || this.bodyPropertyFilter && this.bodyPropertyFilter.length > 0) {
          this.onFilterChange();
        }
        if(params && params.isSelectType) {
          this.isSelectType = params.isSelectType;
          console.log('select type', this.isSelectType);
        }
        this.isLoading = false;
      })
    });
    if (this.allItems.length < 1) this.airtable.loadItems();
  }


  onFilterChange(event?) {
    this.filterredItems = this.allItems
    if (this.searchInput) {
      let userWord1 = this.searchInput;
      let userWord2;
      if (this.searchInput.indexOf(' ') >= 0) {
        userWord1 = this.searchInput.substring(0, this.searchInput.indexOf(' '))
        userWord2 = this.searchInput.substring((this.searchInput.indexOf(' ') + 1));
      }
      const newSearchFilter: Array<Item> = [];
      this.allItems.forEach(item => {
        if (item.title.toLowerCase().includes(userWord1.toLowerCase()) || userWord2 && item.title.toLowerCase().includes(userWord2.toLowerCase())) {
          newSearchFilter.push(item);
          if (newSearchFilter.length > 0) {
            this.filterredItems = newSearchFilter;
          }
        }
      });
    }
    // FILTER ITEM TYPE
    const newTypeFilter: Array<Item> = [];
    if (this.itemTypeFilter) {
      this.itemTypeFilter.forEach(type => {
        console.log(type);
        this.filterredItems.forEach(item => {
          if (item.item_type && item.item_type.toLowerCase().includes(type.toLowerCase())) {
            newTypeFilter.push(item);
          }
        });
      });
      if (newTypeFilter.length > 0) {
        this.filterredItems = newTypeFilter;
      }
      console.log('typefilter:', newTypeFilter);
    }

    // FILTER BODY_PROPERTY
    const newBodyPropertyFilter: Array<Item> = [];
    if (this.bodyPropertyFilter) {
      this.bodyPropertyFilter.forEach(property => {
        this.filterredItems.forEach(item => {
          if (item.body_property && item.body_property.toLowerCase().includes(property.toLowerCase())) {
            newBodyPropertyFilter.push(item);
          }
        });
      });
      if (newBodyPropertyFilter.length > 0) {
        this.filterredItems = newBodyPropertyFilter;
      }
    }
  }

  onItemSelected(item: Item) {
    this.creation.itemSelection.onSelectedItem = item;
    this.router.navigate([this.backUrl]);
    this.accordionGroup.value = undefined;
    // use character-creation service to tell them the item selected;

  }


}
