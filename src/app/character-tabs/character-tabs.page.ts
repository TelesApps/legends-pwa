import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../interfaces/player.interface';
import { AuthService } from '../services/auth.service';
import { CharactersService } from '../services/characters.service';
import { FirebaseDataService } from '../services/firebase-data.service';

@Component({
  selector: 'app-character-tabs',
  templateUrl: './character-tabs.page.html',
  styleUrls: ['./character-tabs.page.scss'],
})
export class CharacterTabsPage implements OnInit, OnDestroy {

  constructor(private auth: AuthService, public characterSer: CharactersService, private firebaseData: FirebaseDataService,
    private router: Router) { }

  ngOnInit() {

    this.checkForRoomSelection();
  }

  async checkForRoomSelection() {
    // const player = await this.auth.getPlayer();
    // console.log('checking user', player);
    // if (!player.currentGameRoom) {
    //   this.router.navigate(['/main-lobby'])
    // }
  }

  async getPlayerCharacters() {
    const player: Player = await this.auth.getPlayer();
    if (!player) {
    } else {
    }
  }

  onViewChange(event: any) {
    const index = this.characterSer.selectedCharacters.getValue().findIndex(c => c.characterId === event.detail.value);
    if(index !== -1) {
      this.characterSer.viewIndex = index;
    }
  }

  ngOnDestroy(): void {
  }

}
