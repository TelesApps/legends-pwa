import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-skills-selection',
  templateUrl: './skills-selection.page.html',
  styleUrls: ['./skills-selection.page.scss'],
})
export class SkillsSelectionPage implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onOpenSkillsList() {
    // const headers: HttpHeaders = new HttpHeaders({
    //   "Authorization" : "Bearer keyiQeUMh8M9dAatG"
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
