import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-abilities-selection',
  templateUrl: './abilities-selection.page.html',
  styleUrls: ['./abilities-selection.page.scss'],
})
export class AbilitiesSelectionPage implements OnInit {

  segmentSelection = 'overview';

  constructor() { }

  ngOnInit() {
  }

  onSegmentChanged(event) {
    console.log(event);
  }

}
