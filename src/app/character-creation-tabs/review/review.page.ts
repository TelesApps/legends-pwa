import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

  portraits: Array<any> = ['first', 'second']
  constructor() { }

  ngOnInit() {
  }

}
