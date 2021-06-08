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

  captureActionState(newState?) {
    this.messageCard = this.message;
    this.isErrorCard = newState["isError"]
      ? newState["isError"].currentValue
      : false;
    this.isSuccessfulCard = newState["isSuccess"]
      ? newState["isSuccess"].currentValue
      : false;
  }
  
  ngOnChanges(changes?) {
    this.captureActionState(changes);
  }

  ngOnInit(): void {}
}
