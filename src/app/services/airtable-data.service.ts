import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  $allItems: Observable<Array<Item>> = new Observable<Array<Item>>();

  constructor(private http: HttpClient) {
    // TO QUERY AIRTABLE FOR SPECIFIC PARAMATERS, USE SOMETHING LIKE THE CODE BELLOW
    //this.options['params'] = {filterByFormula: 'Weight=1'}

  }

  loadItems() {
    const allItems = [];
    // Make an Array of promises for all the calls to get items, then call Once all promises are done.
    this.http.get(`https://api.airtable.com/v0/app0h83f2CwnHyEX3/Weapons/`, this.options).subscribe((response: AirTableData) => {
      response.records.forEach(record => {
        allItems.push(record.fields);
      });
    })
  }
}
