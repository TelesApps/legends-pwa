import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-encyclopedia-tabs',
  templateUrl: './encyclopedia-tabs.page.html',
  styleUrls: ['./encyclopedia-tabs.page.scss'],
})
export class EncyclopediaTabsPage implements OnInit {

  backUrl: string = '/main-lobby'
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if(params && params.breadcrumb) {
        this.backUrl = params.breadcrumb;
      }
    })
  }

}
