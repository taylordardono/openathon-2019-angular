import { Component, OnDestroy, OnInit } from "@angular/core";
import { Event } from "../../models/event.model";
import { EventService } from "../../core/event.service";
import { ErrorService } from "../../core/error.service";
import { oeventsAnimations } from "src/app/shared/animations/animations";
import { Router } from "@angular/router";

@Component({
  selector: "oevents-event-list",
  templateUrl: "./event-list.component.html",
  styleUrls: ["./event-list.component.scss"],
  animations: [oeventsAnimations.headerIn, oeventsAnimations.listIn],
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[];
  selectedCreator: any;
  constructor(
    private route: Router,
    private eventService: EventService,
    private errorService: ErrorService
  ) {}
  ngOnInit() {
    this.eventService.activeEvent = true;
    this.errorService.getCopyrightsBack(3).subscribe((copyright: any) => {
      this.selectedCreator = copyright[0];
      console.log(this.selectedCreator);
    });
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
