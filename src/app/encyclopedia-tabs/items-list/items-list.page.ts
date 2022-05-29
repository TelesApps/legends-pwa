import { Component, OnInit } from '@angular/core';
import { AirtableDataService } from 'src/app/services/airtable-data.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.page.html',
  styleUrls: ['./items-list.page.scss'],
})
export class ItemsListPage implements OnInit {

  constructor(public airtable: AirtableDataService) { }

  ngOnInit() {
  }

  test() {
    this.airtable.loadItems();
    this.airtable.$allItems.subscribe((res) => {
      console.log('all items', res);
    })
  }

}
