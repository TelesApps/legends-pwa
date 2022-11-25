import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';

@Component({
  selector: 'app-portrait-selection',
  templateUrl: './portrait-selection.component.html',
  styleUrls: ['./portrait-selection.component.scss'],
})
export class PortraitSelectionComponent implements OnInit {

  portraitsUrl: Array<string> = []
  constructor(private fireData: FirebaseDataService) { }

  ngOnInit() {
    this.fireData.$allPortraits.subscribe((allUrls) => {
      console.log('allUrls', allUrls);
      this.portraitsUrl = allUrls;
      console.log('this.portraitsUrl', this.portraitsUrl);
    })
    this.fireData.loadAllPortraits();
  }

}
