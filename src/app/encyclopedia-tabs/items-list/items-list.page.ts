import { Component, OnInit } from '@angular/core';
import { isEmpty } from 'rxjs/operators';
import { Item } from 'src/app/interfaces/item.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['./items-list.page.scss'],
})
export class ItemsListPage implements OnInit {

  public allItems: Array<Item> = [];

  constructor(public airtable: AirtableDataService) { }

  ngOnInit() {
    this.airtable.$allItems.subscribe((all_items) => {this.allItems = all_items; console.log(all_items)});
    console.log(this.allItems.length);
    if(this.allItems.length < 1) this.airtable.loadItems();
  }

  test() {
    console.log('isEmpty?', this.airtable.$allItems.pipe(isEmpty()));
    this.airtable.loadItems();
    this.airtable.$allItems.subscribe((res) => {
      console.log('all items', res);
      console.log('isEmpty Again?', this.airtable.$allItems.pipe(isEmpty()));
    })
  }

}
