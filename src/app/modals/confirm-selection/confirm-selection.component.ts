import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-confirm-selection',
  templateUrl: './confirm-selection.component.html',
  styleUrls: ['./confirm-selection.component.scss'],
})
export class ConfirmSelectionComponent implements OnInit {

  @Input() headerTxt: string = 'Are you Sure?'
  @Input() bodyTxt: string = '';

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log(this.headerTxt);
  }

  onCancel() {
    this.modalController.dismiss({
      'isConfirm' : false,
    })
  }

  onConfirm() {
    this.modalController.dismiss({
      'isConfirm' : true,
    })
  }

}
