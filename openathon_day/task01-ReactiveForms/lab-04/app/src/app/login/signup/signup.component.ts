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
  onPetition: boolean;
  constructor(
    private passValidator: PasswordValidatorDirective,
    private route: Router,
    private errorService: ErrorService,
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
    this.errorService.resetValues();
    this.userService
      .signUp(this.signUpForm)
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
        this.onPetition = false;
        this.userService.onPetition = this.onPetition;
      });

    // try {
    //   const success = await this.userService.signUp(this.signUpForm);
    //   this.route.navigate(["/profile"]);
    // } catch (error) {
    //   this.unSuccessSignUp = true;
    // }
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
