import { AfterContentChecked, AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { isEmpty } from 'rxjs/operators';
import { Item } from 'src/app/interfaces/item.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['./items-list.page.scss'],
})
export class ItemsListPage implements OnInit {

  isSelectMode = false;
  public allItems: Array<Item> = [];
  public filterredItems: Array<Item> = [];
  searchInput: string;
  itemTypeFilter: string[];
  bodyPropertyFilter: string[];
  isLoading = true;

  constructor(
    public airtable: AirtableDataService
  ) {
  }

  ngOnInit() {
    this.airtable.$allItems.subscribe((all_items) => {
      this.allItems = all_items;
      this.filterredItems = this.allItems;
      console.log(all_items);
      this.isLoading = false;
    });
    if (this.allItems.length < 1) this.airtable.loadItems();
  }


  onFilterChange(event) {
    console.log(event.detail.value);
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
    console.log('item type filter: ', this.itemTypeFilter);
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
      console.log('property filter:', newBodyPropertyFilter);
    }
  }

  // onFilterBodyProperty(event) {
  //   console.log(event);
  //   const filters: string[] = event.detail.value;
  //   console.log(filters);
  //   const newFilter: Array<Item> = [];
  //   filters.forEach(filter => {
  //     this.allItems.forEach(item => {
  //       if (item.body_property.toLowerCase().includes(filter.toLowerCase())) {
  //         newFilter.push(item);
  //         if (newFilter.length > 0) {
  //           this.filterredItems = newFilter;
  //         }
  //       }
  //     });
  //   });
  // }

  onItemSelected() {

  }


}
