import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, retry, map } from "rxjs/operators";
import { environment, headers } from "../../environments/environment";
import { initializeEvent, Event } from "../models/event.model";
import { ErrorService } from "./error.service";
import {ErrorServiceMock} from "./error-mock.service";
@Injectable()
export class EventService {
  events: Event[];
  activeEvent: boolean;
  constructor(private errorService: ErrorServiceMock, private http: HttpClient) {}
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
    this.errorService.onPetition = true;
    const newEvent: Event = initializeEvent(formData);
    this.addEventBack(newEvent)
      .subscribe(
        (res: any) => {
          if (res["id"]) {
            this.errorService.message = "Event created!";
            this.errorService.successBoolean = true;
          }
        },
        (err) => {
          this.errorService.message = err;
          this.errorService.errorBoolean = true;
        }
      )
      .add(() => {
        //Finish petition mark for the user view whenever its succesfull or not
        this.errorService.onPetition = false;
      });
  }

  addEventBack(newEvent): Observable<any> {
    const url = environment.apiURL + "events";
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

  editEvent(formData, eventID) {
    //Simple check to avoid multiple petitions from the user
    if (this.errorService.onPetition) {
      return;
    }
    this.errorService.onPetition = true;
    let eventEdit: Event = initializeEvent(formData);
    eventEdit.id = eventID;
    this.editEventBack(eventEdit)
      .subscribe(
        (res: any) => {
          if (res["id"]) {
            this.errorService.message = "Event edited!";
            this.errorService.successBoolean = true;
          }
        },
        (err) => {
          this.errorService.message = err;
          this.errorService.errorBoolean = true;
        }
      )
      .add(() => {
        //Finish petition mark for the user view whenever its succesfull or not
        this.errorService.onPetition = false;
      });
  }

  editEventBack(eventEdit): Observable<any> {
    const url = environment.apiURL + "events/" + eventEdit.id;
    return this.http.put(url, eventEdit, { headers }).pipe(
      retry(3),
      map((ev: Event) => {
        //We check if the current user is correctly edited
        if (ev.id && ev.title === eventEdit.title && ev.id === eventEdit.id) {
          return eventEdit;
        }
        return "Event not updated";
      }),
      catchError(this.errorService.handleError)
    );
  }
}
