import { Component, Input, OnChanges, OnInit } from "@angular/core";

@Component({
  selector: "oevents-error-card",
  templateUrl: "./error-card.component.html",
  styleUrls: ["./error-card.component.scss"],
})
export class ErrorCardComponent implements OnInit, OnChanges {
  @Input("isError") isError: boolean;
  @Input("errorMess") errorMess: string;
  constructor() {}
  public isErrorCard: boolean;
  public errorMessCard: string;
  ngOnChanges() {
    this.errorMessCard = this.errorMess;
    this.isErrorCard = this.isError;
  }

  ngOnInit(): void {}
}
