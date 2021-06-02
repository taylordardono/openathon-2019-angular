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
  animations: [animationTask],
})
export class ProfileComponent implements OnInit, OnDestroy {
  public editorMode: boolean;
  public editorForm: FormGroup;
  public unsuccessEdit: boolean;
  public successEdit: boolean;
  public editorFormErr: User;
  private editorChanges: Subscription;
  constructor(private userService: UserDataService) {
    this.editorFormErr = initializeUser();
    const sessionData = JSON.parse(sessionStorage.getItem("user"));
    this.editorForm = new FormGroup({
      name: new FormControl({value: sessionData.name, disabled: true}, Validators.required),
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

  editMode(){
    if (!this.editorForm) {
      return;
    }
    this.successEdit = false;
    this.editorForm.get("name").enable();
    this.editorMode = true;
  }

  //In case we missclick the edit button, just press escape to set back to view mode
  resetProfile() {
    if (!this.editorForm) {
      return;
    }
    const sessionData = JSON.parse(sessionStorage.getItem("user"));
    this.editorForm.get("name").setValue(sessionData.name);
    this.editorForm.get("name").disable();
    this.editorMode = false;
  }

  async userEdit() {
    if (!this.editorForm) {
      return;
    }
    this.unsuccessEdit = false;
    this.successEdit = false;
    try {
      const success = await this.userService.userEdit({
        name: this.editorForm.get("name").value,
        id: this.editorForm.get("id").value,
      });
      this.successEdit = true;
      this.editorMode = false;
    } catch (error) {
      this.unsuccessEdit = true;
    }
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.editorChanges) {
      this.editorChanges.unsubscribe();
    }
  }
}
