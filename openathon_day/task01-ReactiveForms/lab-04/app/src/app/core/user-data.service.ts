import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, retry, map, filter } from "rxjs/operators";
import { initializeUser, User } from "../models/user";
import { environment } from "../../environments/environment";

//common headers for user actions on the webpage
export const headers = new HttpHeaders({
  "Content-Type": "application/json",
});
@Injectable({
  providedIn: "root",
})
export class UserDataService {
  public isAuthenticated: boolean;
  constructor(private http: HttpClient, private route: Router) {}

  logIn(user): Promise<boolean> {
    const url =
      environment.apiURL +
      "users?name=" +
      user.name +
      "&password=" +
      user.password;
    console.log(url);
    return new Promise((resolve, reject) => {
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
            this.isAuthenticated = true;
            resolve(true);
          } else {
            reject(false);
          }
        });
    });
  }

  signUp(credentials): Promise<boolean> {
    const url = environment.apiURL + "users";
    console.log(url);
    const newUser: User = initializeUser(credentials);
    return new Promise((resolve, reject) => {
      this.http
        .post(url, newUser, { headers })
        .pipe(
          retry(3),
          map((us: Array<User>) => {
            //We check if the current user is registered by selecting the last one of the
            //users array
            if (
              us.length > 0 &&
              us[us.length - 1].password ===
                credentials.get("password").value &&
              us[us.length - 1].name === credentials.get("name").value
            ) {
              sessionStorage.setItem(
                "user",
                JSON.stringify({
                  user: us[us.length - 1].name,
                  id: us[us.length - 1].id,
                })
              );
              return us[us.length - 1];
            }
            return "User not registered";
          })
        )
        .subscribe((d) => {
          console.log(d);
          if (d) {
            resolve(true);
          } else {
            reject(false);
          }
        });
    });
  }

  logOut() {
    sessionStorage.removeItem("user");
    this.isAuthenticated = false;
    this.route.navigate(["/home"]);
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
