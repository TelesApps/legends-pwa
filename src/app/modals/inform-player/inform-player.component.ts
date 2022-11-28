import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-inform-player',
  templateUrl: './inform-player.component.html',
  styleUrls: ['./inform-player.component.scss'],
})
export class InformPlayerComponent implements OnInit {

  @Input() headerTxt: string = 'Please Note'
  @Input() bodyTxt: string = `You'll receive usefull tips in messages like this`;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  close() {
    this.modalController.dismiss()
  }

}
