import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserDataService } from "../core/user-data.service";
import { validationMessages } from "../../environments/environment";
import { initializeUser } from "../models/user";
import { animationTask } from "../shared/animations/animations";
import { Subscription } from "rxjs";
import { stringify } from "@angular/compiler/src/util";

@Component({
  selector: "oevents-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  animations: [animationTask.headerIn],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginFormErr: Object = {};
  formChanges: Subscription;
  onPetition: boolean;
  constructor(private route: Router, private userService: UserDataService) {
    this.loginFormErr = initializeUser();
    this.loginForm = new FormGroup({
      name: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
    this.formChanges = this.loginForm.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );
  }

  private onValueChanged(changes?: any) {
    if (!this.loginForm) {
      return;
    }
    const form = this.loginForm;
    for (const field in this.loginFormErr) {
      //We are not using date property, wich is a Date type object, so, we will use
      //try catch method until we decide what we should do with the date property
      this.loginFormErr[field] = "";
      const control = form.get(field);
      if (control && control.touched && !control.valid) {
        for (const key in validationMessages) {
          let success: boolean = true;
          if (control.hasError(key)) {
            success = false;
          }
          if (!success) {
            this.loginFormErr[field] = validationMessages[key];
          }
        }
      }
    }
  }

  public userLogin() {
    if (!this.loginForm) {
      return;
    }
    this.userService
      .logIn({
        name: this.loginForm.get("name").value,
        password: this.loginForm.get("password").value,
      })
      .subscribe(
        (res: any) => {
          if (res["id"]) {
            this.route.navigate(["/profile"]);
          }
        },
        (err) => {
          this.loginForm.get("password").reset("");
          this.userService.errMess = err;
          this.userService.errorBoolean = true;
        }
      )
      .add(() => {
        //Finish petition mark for the user view whenever its succesfull or not
        this.onPetition = false;
        this.userService.onPetition = this.onPetition;
      });
    // try {
    //   const success = await this.userService.logIn({
    //     name: this.loginForm.get("name").value,
    //     password: this.loginForm.get("password").value,
    //   });
    //   this.route.navigate(["/events", "add-event"]);
    // } catch (error) {
    //   this.unsuccessLogin = true;
    //   this.loginForm.get("password").reset("");
    // }
  }

  ngOnInit() {}

  ngOnDestroy() {
    //Avoid the memory leak from the valueChanges of the form
    if (this.formChanges) {
      this.formChanges.unsubscribe();
    }
  }
}
