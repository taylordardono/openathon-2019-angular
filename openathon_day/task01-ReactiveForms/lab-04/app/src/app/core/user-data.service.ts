import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, retry, map, filter } from "rxjs/operators";
import { User } from "../models/user";
import { environment } from "../../environments/environment";

//common headers for user actions on the webpage
export const headers = new HttpHeaders({
  "Content-Type": "application/json",
});
@Injectable({
  providedIn: "root",
})
export class UserDataService {
  userArray: User[] = new Array();
  http: HttpClient;
  route: Router;
  constructor(http: HttpClient, route: Router) {
    this.http = http;
    this.route = route;
    console.log(this.route);
  }
  logIn(user): Promise<boolean> {
    const url =
      environment.apiURL +
      "users?name=" +
      user.name +
      "&password=" +
      user.password;
    console.log(url);  
    return new Promise((resolve, reject) =>{
      this.http
      .get(url, { headers })
      .pipe(
        retry(3),
        map((us: Array<User>) => {
          if (us.length > 0) {
            sessionStorage.setItem(
              "user",
              JSON.stringify({ user: us[0].name, id: us[0].id })
            );
            return us[0].password === user.password
              ? us[0]
              : "Password not valid.";
          }
        })
      )
      .subscribe((d) => {
        console.log(d);
        if (d) {
          resolve(true)
        } else{
          reject(false);
        }
      });
    });
  }
  logOut() {
    localStorage.removeItem("user");
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
}
