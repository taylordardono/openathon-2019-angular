import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry, map } from "rxjs/operators";
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
  public errorBoolean: boolean;
  public errMess: string;
  constructor(private http: HttpClient, private route: Router) {}

  setUser(us) {
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        name: us.name,
        id: us.id,
      })
    );
    this.isAuthenticated = true;
  }

  signUp(formData): Observable<any> {
    const url = environment.apiURL + "users";
    console.log(url);
    const newUser: User = initializeUser(formData);
    return this.http.post(url, newUser, { headers }).pipe(
      retry(3),
      map((us: User) => {
        console.log(us);
        //We check if the current user is succesfully registered by checking its new id
        if (us["id"]) {
          this.setUser(us);
          return us;
        }
        return "User not registered";
      }),
      catchError(this.handleError)
    );
  }

  logIn(user): Observable<any> {
    const url = environment.apiURL + "users?name=" + user.name;
    console.log(url);
    return this.http.get(url, { headers }).pipe(
      retry(3),
      map((us: Array<User>) => {
        console.log(us);
        //We dont have any restriction of duplicate users when registering a new one
        //So we search over all users with the same name and find the one that has a match
        //with the session password
        let usrFound: User;
        us.forEach((usr) => {
          if (usr.password === user.password) {
            usrFound = usr;
            this.setUser(usr);
            return;
          }
        });
        return usrFound.id ? usrFound : "Password not valid.";
      }),
      catchError(this.handleError)
    );
  }

  logOut() {
    sessionStorage.removeItem("user");
    this.isAuthenticated = false;
    this.route.navigate(["/home"]);
  }

  userEdit(user): Observable<any> {
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    const url =
      environment.apiURL +
      "users?" +
      "name=" +
      currentUser.name +
      "&id=" +
      user.id;
    console.log(url);
    return this.http.put(url, user.name, { headers }).pipe(
      retry(3),
      map((us: Array<User>) => {
        //We check if the current user is registered by selecting the last one of the
        //users array
        let editedUser: User = initializeUser();
        if (us.length > 0) {
          us.forEach((usr) => {
            if (usr.name == user.name && usr.id == user.id) {
              this.setUser(usr);
              editedUser = usr;
              return;
            }
          });
        }
        if (editedUser.name) {
          return editedUser;
        }
        return "User not updated";
      }),
      catchError(this.handleError)
    );
  }

  //Example of request handle as a Promise
  // userEdit(user): Promise<boolean> {
  //   const currentUser = JSON.parse(sessionStorage.getItem("user"));
  //   const url =
  //     environment.apiURL +
  //     "users?" +
  //     "name=" +
  //     currentUser.name +
  //     "&id=" +
  //     user.id;
  //   console.log(url);
  //   return new Promise((resolve, reject) => {
  //     this.http
  //       .put(url, user.name, { headers })
  //       .pipe(
  //         retry(3),
  //         map((us: Array<User>) => {
  //           //We check if the current user is registered by selecting the last one of the
  //           //users array
  //           let editedUser: User = initializeUser();
  //           if (us.length > 0) {
  //             us.forEach((usr) => {
  //               if (usr.name == user.name && usr.id == user.id) {
  //                 sessionStorage.setItem(
  //                   "user",
  //                   JSON.stringify({
  //                     user: usr.name,
  //                     id: usr.id,
  //                   })
  //                 );
  //                 editedUser = usr;
  //                 return;
  //               }
  //             });
  //           }
  //           if (editedUser.name) {
  //             return editedUser;
  //           }
  //           return "User not updated";
  //         })
  //       )
  //       .subscribe(
  //         (d) => {
  //           console.log(d);
  //           if (d) {
  //             resolve(true);
  //           } else {
  //             reject(false);
  //           }
  //         },
  //         (err) => {
  //           catchError(this.handleError);
  //         }
  //       );
  //   });
  // }

  private handleError(error: HttpErrorResponse) {
    this.errMess = "";
    this.errorBoolean = false;
    let errorMess: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMess = "An error occurred:", error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMess = `Backend returned code ${error.status}, ` + `body was: ${error.error}`;
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened:" + "\n" + errorMess+ ". Please try again later.");
  }
}
