import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-skills-selection',
  templateUrl: './skills-selection.page.html',
  styleUrls: ['./skills-selection.page.scss'],
})
export class SkillsSelectionPage implements OnInit {

  segmentSelection = 'overview';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const selection = params.selection;
      if(selection) {
        this.segmentSelection = params.selection;
      }
    })
  }

  onSegmentChanged(event) {
    console.log(event);
  }

  onOpenSkills(selection: string) {
    this.router.navigate(['/encyclopedia-tabs/skills-traits-list'], {
      replaceUrl: true,
      queryParams: {
        breadcrumb: '/character-creation-tabs/skills-selection',
        isSelectMode: true,
        segmentSelection: selection
      }
    });
  }

}
