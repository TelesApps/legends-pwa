import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-character',
  templateUrl: './select-character.page.html',
  styleUrls: ['./select-character.page.scss'],
})
export class SelectCharacterPage implements OnInit {

  constructor(private route: ActivatedRoute) { }
  backUrl: string = '';

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if(params.breadcrumb) {
        this.backUrl = params.breadcrumb;
      } else {
        this.backUrl = 'main-lobby'
      }
    })
  }

}
