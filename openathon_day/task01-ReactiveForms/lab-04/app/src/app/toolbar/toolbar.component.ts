import { Component, OnInit } from "@angular/core";
import { UserDataService } from "../core/user-data.service";

@Component({
  selector: "oevents-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
})
export class ToolbarComponent implements OnInit {
  constructor(public userService: UserDataService) {}

  public logOut() {
    this.userService.logOut();
  }

  ngOnInit() {}
}
