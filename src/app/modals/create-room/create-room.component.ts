import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Player } from 'src/app/interfaces/player.interface';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {

  createRoomForm: FormGroup;
  roomName: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  publicGame: FormControl = new FormControl({ value: true, disabled: true }, [Validators.required]);
  playerLimit: number = 0;
  charactersPerPlayer: number = 1;
  isLimitError = false;
  totalCharacters: number = 0;
  @Input() player: Player;

  constructor(private modalControl: ModalController) { }

  ngOnInit() {
    this.createRoomForm = new FormGroup({
      roomName: this.roomName
    });
    if (this.player && this.player.selectedCharactersIds.length > 1) {
      this.charactersPerPlayer = this.player.selectedCharactersIds.length;
    }
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
    this.charactersPerPlayer < this.player.selectedCharactersIds.length ? this.isLimitError = true : this.isLimitError = false;
    if (this.charactersPerPlayer === 0)
      this.isLimitError = false;
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
