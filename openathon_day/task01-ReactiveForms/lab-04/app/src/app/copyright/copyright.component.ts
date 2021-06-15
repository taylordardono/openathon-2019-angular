import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "oevents-copyright",
  templateUrl: "./copyright.component.html",
  styleUrls: ["./copyright.component.scss"],
})
export class CopyrightComponent implements OnInit, OnChanges {
  @Input("creator") creator: any;
  constructor() {}

  ngOnInit(): void { }

  ngOnChanges(changes?: SimpleChanges): void {
    console.log(changes);
    for (const property in changes) {
      if (changes[property].previousValue !== changes[property].currentValue) {
        this.creator = changes[property].currentValue;
        console.log("creator updated");
      }
    }
  }
}
