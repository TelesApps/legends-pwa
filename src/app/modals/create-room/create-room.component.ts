import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {

  createRoomForm: FormGroup;
  roomName: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  publicGame: FormControl = new FormControl({value: true, disabled: true}, [Validators.required]);
  playerLimit: number = 0;
  charactersPerPlayer: number = 1;
  totalCharacters: number = 0;

  constructor(private modalControl: ModalController) { }

  ngOnInit() {
    this.createRoomForm = new FormGroup({
      roomName: this.roomName
    })
  }

  onCancel() {
    this.modalControl.dismiss();
  }

  addPlayerLimit(value) {
    this.playerLimit += value;
    if (this.playerLimit < 0) {
      this.playerLimit = 0;
    }
  }

  addCharactersPerPlayer(value) {
    this.charactersPerPlayer += value;
    if (this.charactersPerPlayer < 0) {
      this.charactersPerPlayer = 0;
    }
  }

  addTotalCharactersAllowed(value) {
    this.totalCharacters += value;
    if (this.totalCharacters < 0) {
      this.totalCharacters = 0;
    }
  }

  onCreateRoom() {
    this.modalControl.dismiss({
      status: 'confirm',
      roomName: this.roomName.value,
      publicGame: this.publicGame.value,
      playerLimit: this.playerLimit,
      charactersPerPlayer: this.charactersPerPlayer,
      totalCharacters: this.totalCharacters
    })
  }

}
