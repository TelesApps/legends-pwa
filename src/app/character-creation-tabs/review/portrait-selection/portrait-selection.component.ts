import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { FirebaseDataService } from 'src/app/services/firebase-data.service';

@Component({
  selector: 'app-portrait-selection',
  templateUrl: './portrait-selection.component.html',
  styleUrls: ['./portrait-selection.component.scss'],
})
export class PortraitSelectionComponent implements OnInit {

  isLoading: boolean = true;
  portraitsUrl: Array<string> = []
  constructor(private fireData: FirebaseDataService, private modalController: ModalController) { }

  ngOnInit() {
    this.fireData.$allPortraits.subscribe((allUrls) => {
      this.portraitsUrl = allUrls;
      this.isLoading = false;
    })
    this.fireData.loadAllPortraits();
  }

  onSelect(url: string) {
    this.modalController.dismiss({
      'selection': url,
    })
  }

  cancelSelection() {
    this.modalController.dismiss({
      'selection': null,
    })
  }

}
