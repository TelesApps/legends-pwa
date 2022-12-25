import { Component, OnInit } from '@angular/core';
import { Character } from 'src/app/interfaces/character.interface';
import { CharactersService } from 'src/app/services/characters.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  character: Character;
  constructor(public characterServ: CharactersService) { }

  ngOnInit() {
    this.characterServ.selectedCharacters.subscribe((chracters) => {
      this.character = chracters[0];
    })
  }

}
