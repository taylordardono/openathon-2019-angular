import { Component, OnInit } from '@angular/core';
import { animationTask } from '../shared/animations/animations';

@Component({
  selector: 'oevents-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  animations: [animationTask]
})
export class LandingPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
