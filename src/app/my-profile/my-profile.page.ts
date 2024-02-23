import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CharactersService } from '../services/characters.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  backUrl: string = '';
  
  constructor(private auth: AuthService, private route: ActivatedRoute, private characterService: CharactersService) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if(params) {
        this.backUrl = params.breadcrumb;
      }
    })
  }

  onLogout() {
    this.characterService.selectedCharacters.next([]);
    this.auth.logOut();
  }

}
