import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment'
import { Ability } from '../interfaces/ability.interface';
import { AirTableData } from '../interfaces/airtable-data.interface';
import { Item } from '../interfaces/item.interface';
import { SkillTraits } from '../interfaces/skills-traits.interface';

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
  $skillsTraits: ReplaySubject<Array<SkillTraits>> = new ReplaySubject<Array<SkillTraits>>(1);
  $abilities: ReplaySubject<Array<Ability>> = new ReplaySubject<Array<Ability>>(1);

  constructor(private http: HttpClient) {
    // TO QUERY AIRTABLE FOR SPECIFIC PARAMATERS, USE SOMETHING LIKE THE CODE BELLOW
    //this.options['params'] = {filterByFormula: 'Weight=1'}

  }

  loadItems() {
    const allItems = [];
    const allPromises: Array<Promise<any>> = [];
    console.log('calling')
    const sortByTitleAsc = '?sort%5B0%5D%5Bfield%5D=title&sort%5B0%5D%5Bdirection%5D=asc'
    allPromises.push(this.http.get(`https://api.airtable.com/v0/app0h83f2CwnHyEX3/Weapons/` + sortByTitleAsc, this.options).toPromise());
    allPromises.push(this.http.get(`https://api.airtable.com/v0/app0h83f2CwnHyEX3/Equipment/` + sortByTitleAsc, this.options).toPromise());
    Promise.all(allPromises).then((allData: Array<AirTableData>) => {
      allData.forEach(data => {
        data.records.forEach(record => {
          const item: Item = <Item>record.fields;
          allItems.push(item);
        });
      });
      this.$allItems.next(allItems);
      this.$allItems.complete();
    })
  }

  loadSkillsAndTraits() {
    const sortByTitleAsc = '?sort%5B0%5D%5Bfield%5D=title&sort%5B0%5D%5Bdirection%5D=asc'
    this.http.get(`https://api.airtable.com/v0/app2iTLZLWFFxHulK/Skills/` + sortByTitleAsc, this.options).subscribe((data: AirTableData) => {
      console.log('res from get  skills and traits', data);
      const allSkills: SkillTraits[] = [];
      data.records.forEach(record => {
        const skills: SkillTraits = <SkillTraits>record.fields;
        allSkills.push(skills);
      });
      this.$skillsTraits.next(allSkills);
      this.$skillsTraits.complete();
    })
  }

  loadAbilities() {
    //const sortByTitleAsc = '?sort%5B0%5D%5Bfield%5D=title&sort%5B0%5D%5Bdirection%5D=asc'
    this.http.get(`https://api.airtable.com/v0/appbI9FWav2qCfbIj/AbilityList/`, this.options).subscribe((data: AirTableData) => {
      console.log('res from get abilities', data);
      const allAbilities: Ability[] = [];
      data.records.forEach(record => {
        const skills: Ability = <Ability>record.fields;
        allAbilities.push(skills);
      });
      this.$abilities.next(allAbilities);
      this.$abilities.complete();
    })
  }
}
