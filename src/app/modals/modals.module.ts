import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmSelectionComponent } from './confirm-selection/confirm-selection.component';
import { InformPlayerComponent } from './inform-player/inform-player.component';



@NgModule({
  declarations: [ ConfirmSelectionComponent, InformPlayerComponent ],
  imports: [
    CommonModule
  ],
  exports: [
    ConfirmSelectionComponent,
    InformPlayerComponent
  ]
})
export class ModalsModule { }
