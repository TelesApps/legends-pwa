import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { Character } from 'src/app/interfaces/character.interface';
import { ConfirmSelectionComponent } from 'src/app/modals/confirm-selection/confirm-selection.component';
import { AuthService } from 'src/app/services/auth.service';
import { CharacterCreationService } from 'src/app/services/character-creation.service';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';
import { PortraitSelectionComponent } from './portrait-selection/portrait-selection.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

  classTitles = ['Berserker', 'War Knight', 'Blade Master', 'Bounty Hunter', 'Champion', 'War-Templar', 'Monk', 'Ironclad', 'Samurai',
    'Dragoon', 'Commander', 'War-Paladin', 'Paladin', 'Thief', 'Ninja', 'Arbiter', 'Shadow-Templar', 'Stalker', 'Marksman', 'Hunter',
    'Spectre', 'Sentinel', 'Master Chief', 'Summoner', 'Avant-Garde', 'War-Archon', 'Archon', 'Noble-Archon'];

  // characterName: FormControl = new FormControl('', [Validators.required]);
  characterName: string = '';
  characterBios: string = '';
  selectedClassTitle = '';
  portrait: string;
  character: Character
  constructor(
    private auth: AuthService,
    public creation: CharacterCreationService,
    public modalController: ModalController,
    private router: Router) { }

  ngOnInit() {
    this.creation.characterSubj.subscribe((character) => this.character = character);
  }


  async onPortraitClick() {
    const modal = await this.modalController.create({
      component: PortraitSelectionComponent,
      componentProps: {
        'selectedPortrait': 'something',
      }
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.selection) {
      this.portrait = data.selection;
      this.character.portraitUrl = this.portrait;
    }
  }

  async onSaveCharacter() {
    let headerText = '';
    let bodyText = '';
    if(this.creation.abilityPoints > 5 || this.creation.statsPoints > 0 || this.creation.skillsPoints > 10) {
      headerText = 'You Still Have Creation Points'
      bodyText = `It seems you still have some creation points left that you can use to edit your character, are you sure you want to save it
       anyways? Any unused points will be lost forever`;
    } else {
      headerText = `Are You Sure You're Done?`,
      bodyText = `Once you save this character, you cannot come back here to edit him again, you'll have to create a new character`;
    }
    const modal = await this.modalController.create({
      component: ConfirmSelectionComponent,
      componentProps: {
        'headerTxt': headerText,
        'bodyTxt': bodyText,
        'cancelBtnTxt' : 'Go Back',
        'confirmBtnTxt' : 'Save Character'
      }
    });
    modal.present();
    const { data } = await modal.onWillDismiss();
    if (data && data.isConfirm) {
      this.character.equipments.goldCoins = this.creation.goldPoints;
      this.character.characterName = this.characterName;
      this.character.bios = this.characterBios;
      this.character.classTitle = this.selectedClassTitle;
      this.character.portraitUrl = this.portrait;
      this.auth.Player$.pipe(first()).subscribe((player) => {
        this.creation.saveNewCharacterToCloud(player, this.character).then((res) => {
          console.log('response from saving character:', res);
          this.router.navigate(['/select-character']);

        });
      })
    }

  }

}
