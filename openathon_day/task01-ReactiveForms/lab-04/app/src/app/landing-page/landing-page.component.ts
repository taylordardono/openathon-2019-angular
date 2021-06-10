import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { DynamicComponentDirective } from "../directives/dynamic-component.directive";
import { oeventsAnimations } from "../shared/animations/animations";
import { Lazy1Component } from "./lazy1/lazy1.component";
import { AdDataService } from "../core/ad-data.service";

@Component({
  selector: "oevents-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
  animations: [oeventsAnimations.headerIn],
})
export class LandingPageComponent implements OnInit, OnDestroy, AfterViewInit {
  interval;
  adNumber: number = 0;
  @ViewChild(DynamicComponentDirective, { static: true })
  adHost: DynamicComponentDirective;
  constructor(
    public adService: AdDataService,
    private componentResolver: ComponentFactoryResolver
  ) {}

  dynamicAds(adNumber) {
    const selectedAd = this.adService.loadedAds[adNumber];
    adNumber += 1;
    if (adNumber >= 3) {
      adNumber = 0;
    }
    console.log("new ad");
    if (this.adHost) {
      const newAd =
        this.componentResolver.resolveComponentFactory(Lazy1Component);
      console.log(this.adHost);
      this.adHost.viewRef.clear();
      const componentRef = this.adHost.viewRef.createComponent(newAd);
      (<Lazy1Component>componentRef.instance).ad = selectedAd;
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.adService.loadedAds.length !== 0) {
      this.dynamicAds(this.adNumber);
      this.interval = setInterval(() => {
        this.dynamicAds(this.adNumber);
      }, 3000);
    }
  }

  ngOnDestroy() {
    //Destroy interval to avoid memory leaks
    clearInterval(this.interval);
  }
}
