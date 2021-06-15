import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { initializeUser, User } from "src/app/models/user.model";

@Component({
  selector: "oevents-child",
  templateUrl: "./child.component.html",
  styleUrls: ["./child.component.scss"],
})
export class ChildComponent implements OnInit {
  @Output("eventSent") eventSent: EventEmitter<User> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onClick() {
    this.eventSent.emit(initializeUser());
  }
  
  functionShow() {
    console.log("Access from template variable");
  }
}
