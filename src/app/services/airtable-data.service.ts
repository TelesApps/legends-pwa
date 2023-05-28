import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, forkJoin } from 'rxjs';
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
  isLoadingData = false;
  httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + environment.airtable_token
  });
  options = {
    headers: this.httpHeaders,
  };

  $allItems: BehaviorSubject<Array<Item>> = new BehaviorSubject<Array<Item>>([]);
  $skillsTraits: BehaviorSubject<Array<SkillTraits>> = new BehaviorSubject<Array<SkillTraits>>([]);
  $abilities: BehaviorSubject<Array<Ability>> = new BehaviorSubject<Array<Ability>>([]);
  isLoadDataComplete: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  constructor(private http: HttpClient) {
    // TO QUERY AIRTABLE FOR SPECIFIC PARAMATERS, USE SOMETHING LIKE THE CODE BELLOW
    //this.options['params'] = {filterByFormula: 'Weight=1'}
    // this.$allItems.subscribe(allItems => this.allItems = allItems);
    // this.$skillsTraits.subscribe(skillsTraits => this.skillsTraits = skillsTraits);
    // this.$abilities.subscribe(abilities => this.abilities = abilities);
  }

  loadDatabase() {
    if (!this.isLoadingData && this.$allItems.getValue().length < 1) {
      this.isLoadingData = true;

      const weapons$ = this.fetchItemsFromAirtable('app0h83f2CwnHyEX3', 'Weapons');
      const equipment$ = this.fetchItemsFromAirtable('app0h83f2CwnHyEX3', 'Equipment');
      const skills$ = this.fetchItemsFromAirtable('app2iTLZLWFFxHulK', 'Skills');
      const abilities$ = this.fetchItemsFromAirtable('appbI9FWav2qCfbIj', 'AbilityList');

      forkJoin([weapons$, equipment$, skills$, abilities$]).subscribe(
        ([weapons, equipment, skills, abilities]) => {
          this.$allItems.next([...weapons, ...equipment]);
          this.$skillsTraits.next(skills);
          this.$abilities.next(abilities);
          this.isLoadingData = false;
          this.isLoadDataComplete.next(true);
          this.isLoadDataComplete.complete();
        },
        error => {
          console.error('Error loading data', error);
          this.isLoadingData = false;
        }
      );
    } else {
      console.warn('Did not call airTbale to load Items because allItems Array length is more than 0 or data is already loading');
    }
  }

  private fetchItemsFromAirtable(appId: string, endpoint: string): Observable<any[]> {
    const sortByTitleAsc = '?sort%5B0%5D%5Bfield%5D=title&sort%5B0%5D%5Bdirection%5D=asc';
    const url = `https://api.airtable.com/v0/${appId}/${endpoint}/${sortByTitleAsc}`;

    return this.http.get<AirTableData>(url, this.options).pipe(
      map(data => data.records.map(record => record.fields))
    );
  }


  getItemById(id: string): Item {
    if (id) {
      if (this.$allItems.getValue().length < 1) {
        return undefined;
      }
      const item = this.$allItems.getValue().find(i => i.airtable_id === id);
      if (item) return item;
      else {
        console.error('Item not found');
        return undefined
      }
    } else {
      console.error('id is invalid', id);
      return undefined
    }
  }

  doesItemContainTag(itemId: string, tag: string): boolean {
    if (itemId) {
      const item = this.$allItems.getValue().find(i => i.airtable_id === itemId);
      if (item) {
        if (item.tags) {
          const itemTag = item.tags.find(t => t.toLowerCase() === tag.toLowerCase());
          return itemTag ? true : false;
        }
      }
      else {
        return undefined
      }
    } else {
      console.error('id is invalid', itemId);
      return undefined
    }
  }

  getSkillTraitById(id: string): SkillTraits {
    if (id) {
      const skillTrait = this.$skillsTraits.getValue().find(s => s.airtable_id === id);
      if (skillTrait) return skillTrait
      else {
        console.error('Skill or trait not found');
        return undefined;
      }
    }
    else {
      console.error('id is invalid', id);
      return undefined
    }
  }
}
