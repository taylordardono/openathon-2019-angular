import { Component, Input, OnInit } from "@angular/core";
import { Ad } from "src/app/models/ad.model";
import { oeventsAnimations } from "src/app/shared/animations/animations";

@Component({
  selector: "oevents-lazy1",
  templateUrl: "./lazy1.component.html",
  styleUrls: ["./lazy1.component.scss"],
  animations: [oeventsAnimations.listIn, oeventsAnimations.addOut],
})
export class Lazy1Component implements OnInit {
  @Input("ad") ad: Ad;
  constructor() {}

  ngOnInit(): void {}
}
