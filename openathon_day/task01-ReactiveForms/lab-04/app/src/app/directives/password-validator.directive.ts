import { Directive } from "@angular/core";
import {
  AbstractControl,
  NG_VALIDATORS,
  Validator,
  ValidationErrors,
} from "@angular/forms";

let password1: string = "";
let password2: string = "";
@Directive({
  selector: "[oeventsPasswordValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true,
    },
  ],
})
export class PasswordValidatorDirective implements Validator {
  validate(controlCheck: AbstractControl): ValidationErrors | null {
    const control = controlCheck;
    password2 = control.value;
    // console.log(password1);
    // console.log(password2);
    if (password1 !== password2) {
      return { passwordNotMatch: true };
    }
    return null;
  }

  passwordSave(controlCheck: AbstractControl): ValidationErrors | null {
    const control = controlCheck;
    password1 = control.value;
    return null;
  }
  // validate2(controlCheck: AbstractControl): ValidationErrors | null {
  //   if (!controlCheck) {
  //     return;
  //   }
  //   const control = controlCheck;
  //   password2 = control.value;
  //   if (password2 !== password1) {
  //     return { passwordNotMatch: true };
  //   }
  //   return null;
  // }
}
