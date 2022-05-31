import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmSelectionComponent } from './confirm-selection/confirm-selection.component';
import { InformPlayerComponent } from './inform-player/inform-player.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';



@NgModule({
  entryComponents: [ConfirmSelectionComponent, InformPlayerComponent],
  declarations: [ ConfirmSelectionComponent, InformPlayerComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    ConfirmSelectionComponent,
    InformPlayerComponent
  ]
})
export class ModalsModule { }
