import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsListPageRoutingModule } from './items-list-routing.module';

import { ItemsListPage } from './items-list.page';
import { AirtableDataService } from 'src/app/services/airtable-data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsListPageRoutingModule
  ],
  declarations: [ItemsListPage],
  providers: [AirtableDataService]
})
export class ItemsListPageModule {}
