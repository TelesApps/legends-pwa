import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewPageRoutingModule } from './review-routing.module';

import { ReviewPage } from './review.page';
import { PortraitSelectionComponent } from './portrait-selection/portrait-selection.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReviewPageRoutingModule
  ],
  declarations: [ReviewPage, PortraitSelectionComponent]
})
export class ReviewPageModule {}
