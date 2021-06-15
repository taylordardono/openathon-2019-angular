import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EventService } from "src/app/core/event.service";
import { ErrorService } from "src/app/core/error.service";
import { oeventsAnimations } from "src/app/shared/animations/animations";
import { Event } from "../../models/event.model";

@Component({
  selector: "oevents-event-details",
  templateUrl: "./event-details.component.html",
  styleUrls: ["./event-details.component.scss"],
  animations: [oeventsAnimations.headerIn, oeventsAnimations.detailIn],
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  event: Event;
  authorizedEditor: boolean;
  selectedCreator: any;
  constructor(
    private route: Router,
    private acivatedRoute: ActivatedRoute,
    private eventService: EventService,
    private errorService: ErrorService
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
    } else {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (user.name === this.event.addedBy) {
        this.authorizedEditor = true;
      }
    }
  }

  goToEditionMode() {
    this.route.navigate(["/events", "add-event", this.event.id]);
  }

  ngOnInit() {
    this.eventService.activeEvent = true;
    this.errorService.getCopyrightsBack(4)
    .subscribe((copyright: any) => {
      this.selectedCreator = copyright[0];
      console.log(this.selectedCreator);
    });
    if (!this.eventService.events) {
      this.eventService.getEvents().subscribe((events: Event[]) => {
        this.eventService.events = events;
        this.setEvent();
      });
      return;
    }
    this.setEvent();
  }

  ngOnDestroy() {
    this.eventService.activeEvent = false;
  }
}
