import { Component, OnInit } from '@angular/core';
import { Player } from '../interfaces/player.interface';
import { AuthService } from '../services/auth.service';
import { CharactersService } from '../services/characters.service';
import { FirebaseDataService } from '../services/firebase-data.service';

@Component({
  selector: 'app-main-lobby',
  templateUrl: './main-lobby.page.html',
  styleUrls: ['./main-lobby.page.scss'],
})
export class MainLobbyPage implements OnInit {

  isLoading = true;
  avatarText: string = ''
  photoUrl: string = '';
  player: Player;

  constructor(public auth: AuthService, public charactersService: CharactersService, private firebaseData: FirebaseDataService) { }

  ngOnInit() {
    this.auth.getPlayer().then((player: Player) => {
      if (!player) {
      } else {
        this.player = player;
        this.avatarText = player.userName[0];
        this.avatarText = player.userName.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '')
        this.photoUrl = player.photoUrl;
      }
      this.isLoading = false;
    })
  }

}
