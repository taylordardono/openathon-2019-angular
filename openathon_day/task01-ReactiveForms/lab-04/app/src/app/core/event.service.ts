import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry, map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { initializeEvent, Event } from "../models/event";

//common headers for eventService
export const headers = new HttpHeaders({
  "Content-Type": "application/json",
});
@Injectable({
  providedIn: "root",
})
export class EventService {
  onPetition: boolean;
  errMess: string;
  errorBoolean: boolean;
  events: Event[];
  constructor(private http: HttpClient) {}
  getEvents(): Observable<any> {
    return this.http
      .get(environment.apiURL + "events", { headers })
      .pipe(retry(3), catchError(this.handleError));
  }

  addEvent(formData): Observable<any> {
    //Simple check to avoid multiple petitions from the user
    if (this.onPetition) {
      return;
    }
    const url = environment.apiURL + "events";
    console.log(url);
    const newEvent: Event = initializeEvent(formData);
    this.onPetition = true;
    return this.http.post(url, newEvent, { headers }).pipe(
      retry(3),
      map((ev: Event) => {
        console.log(ev);
        //We check if the current event is succesfully registered by checking its new id
        if (ev["id"]) {
          return ev;
        }
        return "Event not registered";
      }),
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMess: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      (errorMess = "An error occurred:"), error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMess =
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`;
    }
    // return an observable with a user-facing error message
    return throwError(
      "Something bad happened:" +
        "\n" +
        errorMess +
        ". Please try again later." +
        "\n" +
        "Click this displayed message for confirm"
    );
  }
}
