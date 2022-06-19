
import { Component, OnInit } from '@angular/core';
import { Ability } from 'src/app/interfaces/ability.interface';
import { AirtableDataService } from 'src/app/services/airtable-data.service';

@Component({
  selector: 'app-abilities-list',
  templateUrl: './abilities-list.page.html',
  styleUrls: ['./abilities-list.page.scss'],
})
export class AbilitiesListPage implements OnInit {

  allAbilities: Ability[] = [];
  filteredAbilities: Array<Ability> = [];
  isLoading = true;
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

  onSearchChange(e) {

  }

}
