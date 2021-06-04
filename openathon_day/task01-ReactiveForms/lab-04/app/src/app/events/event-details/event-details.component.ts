import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EventService } from "src/app/core/event.service";
import { animationTask } from "src/app/shared/animations/animations";
import { Event } from "../../models/event";

@Component({
  selector: "oevents-event-details",
  templateUrl: "./event-details.component.html",
  styleUrls: ["./event-details.component.scss"],
  animations: [animationTask.headerIn, animationTask.detailIn],
})
export class EventDetailsComponent implements OnInit {
  event: Event;

  constructor(
    private route: Router,
    private acivatedRoute: ActivatedRoute,
    private eventService: EventService
  ) {}

  setEvent() {
    this.eventService.events.forEach((event) => {
      if (this.acivatedRoute.snapshot.params["id"] === event.id) {
        this.event = event;
        return;
      }
    });
    if (!this.event) {
      this.route.navigate(["**"]);
    }
  }

  ngOnInit() {
    if (!this.eventService.events) {
      this.eventService.getEvents().subscribe((events: Event[]) => {
        this.eventService.events = events;
        this.setEvent();
      });
    } else {
      this.setEvent();
    }
  }
}
