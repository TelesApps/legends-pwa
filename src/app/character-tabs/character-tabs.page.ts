import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  viewMode: string = 'party';
  backUrl: string = '';
  selectedCharacterId = '';

  constructor(private auth: AuthService, public characterSer: CharactersService, private firebaseData: FirebaseDataService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params && params.viewMode) {
        this.viewMode = params.viewMode;
      }
      if (params.breadcrumb) {
        this.backUrl = params.breadcrumb;
      }
      if (params.characterIndex) {
        this.characterSer.viewIndex = params.characterIndex;
        this.selectedCharacterId = params.characterId;
        this.onViewChange({ detail: { value: this.selectedCharacterId } });
      }
      console.log(params);

    })
    this.getPlayerCharacters();
  }


  async getPlayerCharacters() {
    const player: Player = await this.auth.getPlayer();
    if (!player) {
    } else {
    }
  }

  onViewChange(event: any) {
    console.log(event)
    const index = this.characterSer.selectedCharacters.getValue().findIndex(c => c.characterId === event.detail.value);

    if (index !== -1) {
      this.characterSer.viewIndex = index;
      this.router.navigate([], {
        queryParams: {
          'breadcrumb': 'main-lobby',
          'characterId': event.detail.value,
          'characterIndex': index
        },
        queryParamsHandling: 'merge'
      })
    }
  }

  ngOnDestroy(): void {
  }

}
