import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {

  backUrl: string = '';
  
  constructor(private auth: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if(params) {
        this.backUrl = params.breadcrumb;
      }
    })
  }

  onLogout() {
    this.auth.logOut();
  }

}
