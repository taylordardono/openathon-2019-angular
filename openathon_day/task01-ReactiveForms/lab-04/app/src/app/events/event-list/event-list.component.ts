import { Component, OnInit } from "@angular/core";
import { Event } from "../../models/event";

import { EventService } from "../../core/event.service";
import { animationTask } from "src/app/shared/animations/animations";

@Component({
  selector: "oevents-event-list",
  templateUrl: "./event-list.component.html",
  styleUrls: ["./event-list.component.scss"],
  animations: [animationTask.headerIn, animationTask.listIn],
})
export class EventListComponent implements OnInit {
  events: Event[];
  selectedEvent: Event;

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.getEvents();
  }

  onSelectEvent(event: Event) {
    this.selectedEvent = event;
  }

  getEvents() {
    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.events = events;
      this.selectedEvent = events[0];
    });
  }
}
