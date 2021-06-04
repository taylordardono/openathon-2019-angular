import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { validationMessages } from "src/environments/environment";
import { UserDataService } from "../core/user-data.service";
import { initializeUser, User } from "../models/user";
import { animationTask } from "../shared/animations/animations";

@Component({
  selector: "oevents-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  animations: [animationTask.headerIn],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public editorMode: boolean;
  public editorForm: FormGroup;
  public successEdit: boolean;
  public editorFormErr: User;
  private editorChanges: Subscription;
  public onPetition: boolean;
  constructor(private userService: UserDataService) {
    this.editorFormErr = initializeUser();
    const sessionData = JSON.parse(sessionStorage.getItem("user"));
    this.editorForm = new FormGroup({
      name: new FormControl(
        { value: sessionData.name, disabled: true },
        Validators.required
      ),
      id: new FormControl({ value: sessionData.id, disabled: true }),
    });
    this.editorChanges = this.editorForm.valueChanges.subscribe((changes) => {
      this.onValueChanges(changes);
    });
  }

  onValueChanges(changes?) {
    if (!this.editorForm) {
      return;
    }
    const form = this.editorForm;
    for (const field in form) {
      this.editorFormErr[field] = "";
      const control = form.get(field);
      if (control && control.touched && !control.valid) {
        for (const key in validationMessages) {
          this.editorFormErr[field] = validationMessages[key];
        }
      }
    }
  }

  editMode() {
    if (!this.editorForm) {
      return;
    }
    this.successEdit = false;
    this.editorForm.get("name").enable();
    //Its the first input in which we are interested, so just regular query pick
    //Otherwise, select the one we need on inputs array with selectorAll for example
    document.querySelector("input").focus();
    this.editorMode = true;
  }

  //In case we missclick the edit button, just press escape button to set back the view mode
  resetProfile() {
    if (!this.editorForm) {
      return;
    }
    const sessionData = JSON.parse(sessionStorage.getItem("user"));
    this.editorForm.get("name").setValue(sessionData.name);
    this.editorForm.get("name").disable();
    this.editorMode = false;
  }

  public userEdit() {
    if (!this.editorForm) {
      return;
    }
    this.successEdit = false;
    this.userService
      .userEdit({
        name: this.editorForm.get("name").value,
        id: this.editorForm.get("id").value,
      })
      .subscribe(
        (res: any) => {
          if (res["id"]) {
            this.successEdit = true;
            this.editorMode = false;
            this.editorForm.get("name").disable();
          }
        },
        (err) => {
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
    //   const success = await this.userService.userEdit({
    //     name: this.editorForm.get("name").value,
    //     id: this.editorForm.get("id").value,
    //   });
    //   this.successEdit = true;
    //   this.editorMode = false;
    // } catch (error) {
    //   this.unsuccessEdit = true;
    // }
  }

  ngOnInit() {}
  //Avoid the memory leak from the valueChanges of the form
  ngOnDestroy() {
    if (this.editorChanges) {
      this.editorChanges.unsubscribe();
    }
  }
}
