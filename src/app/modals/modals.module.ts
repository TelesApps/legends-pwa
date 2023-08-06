import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmSelectionComponent } from './confirm-selection/confirm-selection.component';
import { InformPlayerComponent } from './inform-player/inform-player.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MoreDetailsComponent } from './more-details/more-details.component';
import { CreateRoomComponent } from './create-room/create-room.component';



@NgModule({
    declarations: [ConfirmSelectionComponent, InformPlayerComponent, MoreDetailsComponent, CreateRoomComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule
    ],
    exports: [
        ConfirmSelectionComponent,
        InformPlayerComponent
    ]
})
export class ModalsModule { }
