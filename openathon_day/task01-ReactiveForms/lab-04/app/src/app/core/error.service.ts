import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class ErrorService {
  errorBoolean: boolean;
  successBoolean: boolean;
  message: String;
  onPetition: boolean;
  constructor() {}

  resetActionStateValues() {
    this.errorBoolean = false;
    this.successBoolean = false;
    this.message = "";
  }

  // Error handling
  handleError(error: HttpErrorResponse) {
    let errorMess: String;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMess = `An error occurred:, error.error.message`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMess = `Backend returned code ${error.status}, body was: ${error.error}`;
    }
    // return an observable with a user-facing error message
    return throwError(
      `Something bad happened:\n${errorMess}. Please try again later.\nClick this displayed message for confirm`
    );
  }
}
