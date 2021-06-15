import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, map, catchError } from "rxjs/operators";
import { environment, headers } from "../../environments/environment";

@Injectable()
export class ErrorServiceMock {
  errorBoolean: boolean;
  successBoolean: boolean;
  message: String;
  onPetition: boolean;
  copyrightsArray: Array<any> = new Array();
  selectedCreator: any;
  http: HttpClient;
  constructor() {}

  resetActionStateValues() {
    this.errorBoolean = false;
    this.successBoolean = false;
    this.message = "";
  }

  getCopyrightsBack(index?): Observable<any> {
    const url = environment.apiURL + "copyrights";
    return this.http.get(url, { headers }).pipe(
      retry(3),
      map((creators: Array<any>) => {
        return creators.filter((creator, ind) => {
          if (ind === 3) {
            return creator;
          }
        });
      }),
      catchError(this.handleError)
    );
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
