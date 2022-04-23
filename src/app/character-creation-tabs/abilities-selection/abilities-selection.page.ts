import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-abilities-selection',
  templateUrl: './abilities-selection.page.html',
  styleUrls: ['./abilities-selection.page.scss'],
})
export class AbilitiesSelectionPage implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onOpenAbilitiesList() {
    // const headers: HttpHeaders = new HttpHeaders({
    //   "Authorization" : "Bearer "
    // })
    // console.log('calling airtable')
    // this.http.delete('https://api.airtable.com/v0/app7aRxuTeZPmuQlE/Skills/rec7vO1XFV6bTXF4r', { headers }).subscribe((res) => {
    //   console.log('res from airtable');
    //   console.log(res);
    // }, (err) => {
    //   console.log('error occured');
    //   console.error(err);
    // })
  }

}
