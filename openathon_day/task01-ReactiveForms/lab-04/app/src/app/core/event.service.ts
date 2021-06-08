import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, retry, map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { initializeEvent, Event } from "../models/event";
import { ErrorService } from "./error.service";

//common headers for eventService
export const headers = new HttpHeaders({
  "Content-Type": "application/json",
});
@Injectable({
  providedIn: "root",
})
export class EventService {
  events: Event[];
  activeEvent: boolean;
  constructor(private errorService: ErrorService, private http: HttpClient) {}
  getEvents(): Observable<any> {
    return this.http
      .get(environment.apiURL + "events", { headers })
      .pipe(retry(3), catchError(this.errorService.handleError));
  }

  addEvent(formData): Observable<any> {
    //Simple check to avoid multiple petitions from the user
    if (this.errorService.onPetition) {
      return;
    }
    const url = environment.apiURL + "events";
    const newEvent: Event = initializeEvent(formData);
    this.errorService.onPetition = true;
    return this.http.post(url, newEvent, { headers }).pipe(
      retry(3),
      map((ev: Event) => {
        //We check if the current event is succesfully registered by checking its new id
        if (ev["id"]) {
          return ev;
        }
        return "Event not registered";
      }),
      catchError(this.errorService.handleError)
    );
  }

  editEvent(formData, eventID): Observable<any> {
    //Simple check to avoid multiple petitions from the user
    if (this.errorService.onPetition) {
      return;
    }
    let eventEdit: Event = initializeEvent(formData);
    eventEdit.id = eventID;
    const url = environment.apiURL + "events/" + eventEdit.id;
    this.errorService.onPetition = true;
    return this.http.put(url, eventEdit, { headers }).pipe(
      retry(3),
      map((ev: Event) => {
        //We check if the current user is correctly edited
        if (ev["id"]) {
          if (ev.title === eventEdit.title && ev.id === eventEdit.id) {
            return eventEdit;
          }
        }
        return "Event not updated";
      }),
      catchError(this.errorService.handleError)
    );
  }
}
