import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-encyclopedia-tabs',
  templateUrl: './encyclopedia-tabs.page.html',
  styleUrls: ['./encyclopedia-tabs.page.scss'],
})
export class EncyclopediaTabsPage implements OnInit {

  backUrl: string = '/main-lobby'
  backQuerySegmentSelection: {selection: string} = undefined
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.backQuerySegmentSelection = undefined;
      if(params && params.breadcrumb) {
        this.backUrl = params.breadcrumb;
        if(params.segmentSelection) {
          console.log('params.segmentSelection', params.segmentSelection);
          this.backQuerySegmentSelection = {selection: params.segmentSelection}
        }
        console.log('this.backUrl', this.backUrl);
      }
    })
  }

}
