import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Character } from '../interfaces/character.interface';
import { FirebaseDataService } from '../services/firebase-data.service';

@Component({
  selector: 'app-select-character',
  templateUrl: './select-character.page.html',
  styleUrls: ['./select-character.page.scss'],
})
export class SelectCharacterPage implements OnInit {

  characters: Array<Character> = [];
  backUrl: string = '';
  constructor(private route: ActivatedRoute, private firebaseData: FirebaseDataService) { }

  ngOnInit() {
    this.firebaseData.getAllCharacters().subscribe((characters: Array<Character>) => {
      console.log('characters', characters);
      this.characters = characters;
    });
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if(params.breadcrumb) {
        this.backUrl = params.breadcrumb;
      } else {
        this.backUrl = 'main-lobby'
      }
    })
  }

  onDeleteCharacters() {
    
  }

}
