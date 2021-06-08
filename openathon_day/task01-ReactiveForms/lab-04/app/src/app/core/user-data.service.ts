import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, retry, map } from "rxjs/operators";
import { initializeUser, initializeUserNotForm, User } from "../models/user";
import { environment } from "../../environments/environment";
import { ErrorService } from "./error.service";
import * as bcrypt from "bcryptjs";

//common headers for userService
export const headers = new HttpHeaders({
  "Content-Type": "application/json",
});
@Injectable({
  providedIn: "root",
})
export class UserDataService {
  public isAuthenticated: boolean;
  constructor(
    private errorService: ErrorService,
    private http: HttpClient,
    private route: Router
  ) {}

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

  hashPassword({ password }): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (hash) {
          resolve(hash);
        }
        reject("Error on hashing password");
      });
    });
  }

  signUpBack(user, headers): Observable<any> {
    const url = environment.apiURL + "users";
    return this.http.post(url, user, { headers }).pipe(
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

  async signUp(formData) {
    //Simple check to avoid multiple petitions from the user
    if (this.errorService.onPetition) {
      return;
    }
    this.errorService.onPetition = true;
    const newUser: User = initializeUser(formData);
    newUser.password = await this.hashPassword(newUser);
    this.signUpBack(newUser, headers)
      .subscribe(
        (res: any) => {
          if (res["id"]) {
            this.route.navigate(["/profile"]);
            return;
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

  checkHashedPassword({ password }, loginPassword): boolean {
    const match = bcrypt.compareSync(loginPassword, password);
    return match;
  }

  logIn(user): boolean {
    //Simple check to avoid multiple petitions from the user
    if (this.errorService.onPetition) {
      return;
    }
    this.errorService.onPetition = true;
    this.logInBack(user)
      .subscribe(
        (res: any) => {
          if (res["id"]) {
            this.route.navigate(["/profile"]);
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

  logInBack(user): Observable<any> {
    const url = environment.apiURL + "users?name=" + user.name;
    return this.http.get(url, { headers }).pipe(
      retry(3),
      map((us: Array<User>) => {
        //We dont have any restriction for duplicate user names when registering a new one
        //So we search over all users with the same name and find the one that has a match
        //with the session password
        const matchUser = us.filter((usr) => {
          if (this.checkHashedPassword(usr, user.password)) return usr;
        }, user);
        if (matchUser[0]) {
          this.setUser(matchUser[0]);
        }
        return matchUser[0].id ? matchUser[0] : "Password not valid.";
      }),
      catchError(this.errorService.handleError)
    );
  }

  logOut() {
    sessionStorage.removeItem("user");
    this.isAuthenticated = false;
    this.route.navigate(["/home"]);
  }

  userEdit(user): Promise<any> {
    //Simple check to avoid multiple petitions from the user
    if (this.errorService.onPetition) {
      return;
    }
    this.errorService.onPetition = true;
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    let userEdit: User = initializeUserNotForm(user, currentUser);
    return new Promise((resolve, reject) => {
      this.userEditBack(userEdit)
        .subscribe(
          (res: any) => {
            if (res["id"]) {
              this.errorService.message = "Profile updated!";
              this.errorService.successBoolean = true;
              resolve(true);
            }
          },
          (err) => {
            this.errorService.message = err;
            this.errorService.errorBoolean = true;
            reject(false);
          }
        )
        .add(() => {
          //Finish petition mark for the user view whenever its succesfull or not
          this.errorService.onPetition = false;
        });
    });
  }

  userEditBack(userEdit): Observable<any> {
    const url = environment.apiURL + "users/" + userEdit.id;
    return this.http.put(url, userEdit, { headers }).pipe(
      retry(3),
      map((us: User) => {
        //We check if the current user is correctly edited
        if (us.id && us.name === userEdit.name && us.id === userEdit.id) {
          this.setUser(userEdit);
          return userEdit;
        }
        return "User not updated";
      }),
      catchError(this.errorService.handleError)
    );
  }
}
