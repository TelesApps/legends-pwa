import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment'
import { AirTableData } from '../interfaces/airtable-data.interface';
import { Item } from '../interfaces/item.interface';

@Injectable({
  providedIn: 'root'
})
export class AirtableDataService {

  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + environment.airtable_key
  });
  options = {
    headers: this.httpHeaders,
  };

  $allItems: ReplaySubject<Array<Item>> = new ReplaySubject<Array<Item>>(1);

  constructor(private http: HttpClient) {
    // TO QUERY AIRTABLE FOR SPECIFIC PARAMATERS, USE SOMETHING LIKE THE CODE BELLOW
    //this.options['params'] = {filterByFormula: 'Weight=1'}

  }

  loadItems() {
    const allItems = [];
    const allPromises: Array<Promise<any>> = [];
    console.log('calling')
    allPromises.push(this.http.get(`https://api.airtable.com/v0/app0h83f2CwnHyEX3/Weapons/`, this.options).toPromise());
    allPromises.push(this.http.get(`https://api.airtable.com/v0/app0h83f2CwnHyEX3/Equipment/`, this.options).toPromise());
    Promise.all(allPromises).then((allData: Array<AirTableData>) => {
      allData.forEach(data => {
        data.records.forEach(record => {
          const item: Item = record.fields;
          allItems.push(item);
        });
      });
      this.$allItems.next(allItems);
    })
  }
}
