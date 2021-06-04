import { Component, OnInit, Input } from "@angular/core";
import {animationTask} from "src/app/shared/animations/animations";
import { Event } from "../../models/event";

@Component({
  selector: "oevents-event-details",
  templateUrl: "./event-details.component.html",
  styleUrls: ["./event-details.component.scss"],
  animations: [animationTask.headerIn, animationTask.detailIn]
})
export class EventDetailsComponent implements OnInit {
  @Input()event: Event;

  constructor() {}

  ngOnInit() {}
}
