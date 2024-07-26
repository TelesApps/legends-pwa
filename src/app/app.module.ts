import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ConfirmSelectionComponent } from './modals/confirm-selection/confirm-selection.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AirtableDataService } from './services/airtable-data.service';
import { ItemsListPage } from './encyclopedia-tabs/items-list/items-list.page';
import { FormsModule } from '@angular/forms';
import { CharacterCreationTabsPageModule } from './character-creation-tabs/character-creation-tabs.module';
import { CharacterTabsPageModule } from './character-tabs/character-tabs.module';
import { EncyclopediaTabsPageModule } from './encyclopedia-tabs/encyclopedia-tabs.module';
import { LoginPageModule } from './login/login.module';
import { MainLobbyPageModule } from './main-lobby/main-lobby.module';
import { MyProfilePageModule } from './my-profile/my-profile.module';
import { SelectCharacterPageModule } from './select-character/select-character.module';
import { InformPlayerComponent } from './modals/inform-player/inform-player.component';
import { ModalsModule } from './modals/modals.module';
import { CharacterCreationService } from './services/character-creation.service';
import { CalculationsService } from './services/calculations.service';
import { GameRoomsService } from './services/game-rooms.service';

firebase.initializeApp(environment.firebaseConfig);

@NgModule({ declarations: [AppComponent, ItemsListPage],
    bootstrap: [AppComponent], imports: [BrowserModule,
        FormsModule,
        IonicModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AppRoutingModule,
        LoginPageModule,
        MainLobbyPageModule,
        SelectCharacterPageModule,
        MyProfilePageModule,
        CharacterCreationTabsPageModule,
        CharacterTabsPageModule,
        EncyclopediaTabsPageModule,
        ModalsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })], providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        CharacterCreationService,
        AirtableDataService,
        CalculationsService,
        GameRoomsService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {}
