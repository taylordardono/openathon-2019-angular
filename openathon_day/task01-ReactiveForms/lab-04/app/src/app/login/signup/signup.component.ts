import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserDataService } from "../../core/user-data.service";
import { ErrorService } from "../../core/error.service";
import { validationMessages } from "../../../environments/environment";
import { animationTask } from "../../shared/animations/animations";
import { Subscription } from "rxjs";
import { initializeProfile, Profile } from "src/app/models/profile";
import { PasswordValidatorDirective } from "src/app/directives/password-validator.directive";

@Component({
  selector: "oevents-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
  animations: [animationTask.headerIn],
  providers: [PasswordValidatorDirective],
})
export class SignupComponent implements OnInit, OnDestroy {
  showPass: boolean;
  iconShow: String = "visibility";
  signUpForm: FormGroup;
  formChanges: Subscription;
  signUpFormErr: Profile;
  constructor(
    private passValidator: PasswordValidatorDirective,
    private route: Router,
    public errorService: ErrorService,
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
    const form = this.signUpForm;
    for (const field in this.signUpFormErr) {
      this.signUpFormErr[field] = "";
      const control = form.get(field);
      if (
        control &&
        control.touched &&
        (!control.valid || form.hasError(field))
      ) {
        for (const key in validationMessages) {
          let success: boolean = true;
          if (control.hasError(key)) {
            success = false;
          }
          if (!success) {
            this.signUpFormErr[field] = validationMessages[key];
          }
        }
      }
    }
  }

  public userSignUp() {
    if (!this.signUpForm) {
      return;
    }
    //Reset of error/success message and variables
    this.errorService.resetActionStateValues();
    this.userService.signUp(this.signUpForm);
  }

  public showPassword() {
    if (this.iconShow === "visibility") {
      this.iconShow = "visibility_off";
      return;
    }
    this.iconShow = "visibility";
  }

  ngOnInit(): void {}
  //Avoid the memory leak from the valueChanges of the form
  ngOnDestroy() {
    if (this.formChanges) {
      this.formChanges.unsubscribe();
    }
  }
}
