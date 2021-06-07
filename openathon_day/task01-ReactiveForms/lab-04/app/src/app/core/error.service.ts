import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  errorBoolean: boolean;
  successBoolean: boolean;
  message: String;
  constructor() {}

  resetValues() {
    this.errorBoolean = false;
    this.successBoolean = false;
    this.message = "";
  }
}
