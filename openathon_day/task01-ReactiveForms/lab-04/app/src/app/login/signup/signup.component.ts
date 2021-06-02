import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserDataService } from "../../core/user-data.service";
import { validationMessages } from "../../../environments/environment";
import { animationTask } from "../../shared/animations/animations";
import { Subscription } from "rxjs";
import { initializeProfile, Profile } from "src/app/models/profile";
import { PasswordValidatorDirective } from "src/app/directives/password-validator.directive";

@Component({
  selector: "oevents-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  animations: [animationTask],
  providers: [PasswordValidatorDirective],
})
export class SignupComponent implements OnInit, OnDestroy {
  unSuccessSignUp: boolean;
  showPass: boolean;
  iconShow: string = "visibility";
  signUpForm: FormGroup;
  formChanges: Subscription;
  signUpFormErr: Profile;
  constructor(
    private passValidator: PasswordValidatorDirective,
    private route: Router,
    private userService: UserDataService
  ) {
    this.signUpFormErr = initializeProfile();
    this.signUpForm = new FormGroup({
      name: new FormControl("", Validators.required),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        this.passValidator.passwordSave,
        this.passValidator.validate,
      ]),
      passwordNotMatch: new FormControl("", [
        Validators.required,
        this.passValidator.validate,
      ]),
    });
    this.formChanges = this.signUpForm.valueChanges.subscribe((data) => {
      this.onValueChanges(data);
    });
  }

  private onValueChanges(changes?: any) {
    if (!this.signUpForm) {
      return;
    }
    this.unSuccessSignUp = false;
    const form = this.signUpForm;
    for (const field in this.signUpFormErr) {
      //We are not using date property, wich is a Date type object, so, we will use
      //try catch method until we decide what we should do with the date property
      this.signUpFormErr[field] = "";
      const control = form.get(field);
      if (
        control &&
        control.touched &&
        (!control.valid || form.hasError(field))
      ) {
        for (const key in validationMessages) {
          let completeKey: string = String(key);
          let success: boolean = true;
          if (completeKey.indexOf("length") !== -1) {
            if (control.hasError("minlength")) {
              success = false;
            } else if (control.hasError("maxlength")) {
              success = false;
            }
          } else {
            if (control.hasError(completeKey)) {
              success = false;
            }
          }
          if (!success) {
            this.signUpFormErr[field] = validationMessages[key];
          }
        }
      }
    }
  }

  public async userSignUp() {
    if (!this.signUpForm) {
      return;
    }
    try {
      const success = await this.userService.signUp(this.signUpForm);
      this.route.navigate(["/profile"]);
    } catch (error) {
      this.unSuccessSignUp = true;
    }
  }

  public showPassword() {
    if (this.iconShow === "visibility") {
      this.iconShow = "visibility_off";
      return;
    }
    this.iconShow = "visibility";
  }
  ngOnInit(): void {}
  ngOnDestroy() {
    if (this.formChanges) {
      this.formChanges.unsubscribe();
    }
  }
}
