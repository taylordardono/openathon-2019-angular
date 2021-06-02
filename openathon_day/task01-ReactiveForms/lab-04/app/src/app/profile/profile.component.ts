import { Component, OnInit } from '@angular/core';
import { animationTask } from '../shared/animations/animations';

@Component({
  selector: 'oevents-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [animationTask]
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
