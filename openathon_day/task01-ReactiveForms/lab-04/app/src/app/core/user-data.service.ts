import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, retry, map } from "rxjs/operators";
import { initializeUser, User } from "../models/user";
import { environment } from "../../environments/environment";
import {ErrorService} from "./error.service";

//common headers for userService
export const headers = new HttpHeaders({
  "Content-Type": "application/json",
});
@Injectable({
  providedIn: "root",
})
export class UserDataService {
  public isAuthenticated: boolean;
  constructor(private errorService: ErrorService, private http: HttpClient, private route: Router) {}

  setUser(us) {
    sessionStorage.setItem(
      "user",
      JSON.stringify({
        name: us.name,
        id: us.id,
        password: us.password,
      })
    );
    this.isAuthenticated = true;
  }

  signUp(formData): Observable<any> {
    //Simple check to avoid multiple petitions from the user
    if (this.errorService.onPetition) {
      return;
    }
    const url = environment.apiURL + "users";
    const newUser: User = initializeUser(formData);
    this.errorService.onPetition = true;
    return this.http.post(url, newUser, { headers }).pipe(
      retry(3),
      map((us: User) => {
        //We check if the current user is succesfully registered by checking its new id
        if (us["id"]) {
          this.setUser(us);
          return us;
        }
        return "User not registered";
      }),
      catchError(this.errorService.handleError)
    );
  }

  logIn(user): Observable<any> {
    //Simple check to avoid multiple petitions from the user
    if (this.errorService.onPetition) {
      return;
    }
    const url = environment.apiURL + "users?name=" + user.name;
    this.errorService.onPetition = true;
    return this.http.get(url, { headers }).pipe(
      retry(3),
      map((us: Array<User>) => {
        //We dont have any restriction for duplicate user names when registering a new one
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
      catchError(this.errorService.handleError)
    );
  }

  logOut() {
    sessionStorage.removeItem("user");
    this.isAuthenticated = false;
    this.route.navigate(["/home"]);
  }

  userEdit(user): Observable<any> {
    //Simple check to avoid multiple petitions from the user
    if (this.errorService.onPetition) {
      return;
    }
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    let userEdit: User = initializeUser();
    userEdit.name = user.name;
    userEdit.id = currentUser.id;
    userEdit.password = currentUser.password;
    const url = environment.apiURL + "users/" + user.id;
    this.errorService.onPetition = true;
    return this.http.put(url, userEdit, { headers }).pipe(
      retry(3),
      map((us: User) => {
        //We check if the current user is correctly edited
        if (us["id"]) {
          if (us.name === userEdit.name && us.id === userEdit.id) {
            this.setUser(userEdit);
            return userEdit;
          }
        }
        return "User not updated";
      }),
      catchError(this.errorService.handleError)
    );
  }
}
