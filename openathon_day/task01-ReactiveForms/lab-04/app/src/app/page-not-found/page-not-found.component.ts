import { Component, OnInit } from '@angular/core';
import {animationTask} from '../shared/animations/animations';

@Component({
  selector: 'oevents-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  animations: [animationTask.headerIn]
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
