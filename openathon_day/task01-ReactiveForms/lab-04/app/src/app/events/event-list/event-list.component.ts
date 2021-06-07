import { Component, OnDestroy, OnInit } from "@angular/core";
import { Event } from "../../models/event";

import { EventService } from "../../core/event.service";
import { animationTask } from "src/app/shared/animations/animations";
import { Router } from "@angular/router";

@Component({
  selector: "oevents-event-list",
  templateUrl: "./event-list.component.html",
  styleUrls: ["./event-list.component.scss"],
  animations: [animationTask.headerIn, animationTask.listIn],
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[];
  constructor(private route: Router, private eventService: EventService) {}
  ngOnInit() {
    this.eventService.activeEvent = true;
    this.getEvents();
  }

  onSelectEvent(event: Event) {
    this.route.navigate(["/events", event.id]);
  }

  getEvents() {
    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.eventService.events = events;
      this.events = events;
    });
  }

  ngOnDestroy() {
    this.eventService.activeEvent = false;
  }
}
