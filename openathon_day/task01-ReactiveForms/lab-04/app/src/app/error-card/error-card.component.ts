import { Component, Input, OnChanges, OnInit } from "@angular/core";

@Component({
  selector: "oevents-error-card",
  templateUrl: "./error-card.component.html",
  styleUrls: ["./error-card.component.scss"],
})
export class ErrorCardComponent implements OnInit, OnChanges {
  @Input("isError") isError: boolean;
  @Input("message") message: string;
  @Input("isSuccess") isSuccess: boolean;
  constructor() {}
  public isErrorCard: boolean;
  public messageCard: string;
  public isSuccessfulCard: boolean;
  ngOnChanges(changes?) {
    this.messageCard = this.message;
    this.isErrorCard = changes["isError"]
      ? changes["isError"].currentValue
      : false;
    this.isSuccessfulCard = changes["isSuccess"]
      ? changes["isSuccess"].currentValue
      : false;
  }

  ngOnInit(): void {}
}
