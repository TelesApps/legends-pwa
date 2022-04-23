import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skills-selection',
  templateUrl: './skills-selection.page.html',
  styleUrls: ['./skills-selection.page.scss'],
})
export class SkillsSelectionPage implements OnInit {

  segmentSelection = 'overview';

  constructor() { }

  ngOnInit() {
  }

  onSegmentChanged(event) {
    console.log(event);
  }

}
