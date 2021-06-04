import { Component, HostBinding, HostListener, OnInit } from "@angular/core";
import { UserDataService } from "../core/user-data.service";

@Component({
  selector: "oevents-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
})
export class ToolbarComponent implements OnInit {
  activeEvent: boolean;
  //Example of too much work for setting a active style in the Event area of the toolbar
  @HostListener("click", ["$event"]) onToolbarClick(event) {
    console.log(event);
    if (location.pathname.search(new RegExp(/\bevents\/\b/, "gmi")) !== -1) {
      this.activeEvent = true;
    } else {
      this.activeEvent = false;
    }
  }
  constructor(public userService: UserDataService) {}
  public logOut() {
    this.userService.logOut();
  }
  ngOnInit() {}
}
