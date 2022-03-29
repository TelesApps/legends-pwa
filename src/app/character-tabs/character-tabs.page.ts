import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-character-tabs',
  templateUrl: './character-tabs.page.html',
  styleUrls: ['./character-tabs.page.scss'],
})
export class CharacterTabsPage implements OnInit, OnDestroy {

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.checkForRoomSelection();
  }

  async checkForRoomSelection() {
    console.log('checking');
    this.auth.Player$.subscribe((player) => {
      console.log('checking user', player);
      if (!player.currentGameRoom) {
        this.router.navigate(['/main-lobby'])
      }
    });
  }

  ngOnDestroy(): void {
  }

}
