import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserDataService } from "./core/user-data.service";
import { ErrorService } from "./core/error.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AdDataService } from "./core/ad-data.service";
import { Ad } from "./models/ad.model";

@Component({
  selector: "oevents-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private route: Router,
    private adService: AdDataService,
    public errorService: ErrorService,
    public userService: UserDataService
  ) {}
  title = "open-events-front";
  routerSubscription: Subscription;
  ngOnInit(): void {
    if (sessionStorage.getItem("user")) {
      this.userService.isAuthenticated = true;
    }
    if (this.adService.loadedAds.length === 0) {
      this.adService.getAds().subscribe((ads: Ad[]) => {
        this.adService.loadedAds = ads;
        console.log(this.adService.loadedAds);
      });
    }
    //If user does not close the success and error alerts by itself
    //we make sure that they disappear when the user goes to another component of the page
    this.routerSubscription = this.route.events.subscribe((changes) => {
      this.errorService.resetActionStateValues();
    });
  }

  ngOnDestroy(): void {
    //Avoid memory leaks of the subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
