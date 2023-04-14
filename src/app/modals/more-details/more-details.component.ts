import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-more-details',
  templateUrl: './more-details.component.html',
  styleUrls: ['./more-details.component.scss'],
})
export class MoreDetailsComponent implements OnInit {

  @Input() headerTxt: string = ''
  @Input() statDetails: string = ``;

  constructor(private modal: ModalController) { }

  ngOnInit() {}

  close() {
    this.modal.dismiss();
  }

}
