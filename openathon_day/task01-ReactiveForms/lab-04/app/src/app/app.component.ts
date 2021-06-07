import { Component, OnInit } from "@angular/core";
import { UserDataService } from "./core/user-data.service";
import { ErrorService } from "./core/error.service";

@Component({
  selector: "oevents-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(public errorService: ErrorService, public userService: UserDataService) {}
  title = "open-events-front";
  ngOnInit(): void {
    if (sessionStorage.getItem("user")) {
      this.userService.isAuthenticated = true;
    }
  }
}
