import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Event, initializeEvent } from "../../models/event";
import { validationMessages } from "../../../environments/environment";
import { Subscription } from "rxjs";
import { EventService } from "src/app/core/event.service";
import { animationTask } from "src/app/shared/animations/animations";
import { Router } from "@angular/router";

@Component({
  selector: "oevents-add-edit-form",
  templateUrl: "./add-edit-form.component.html",
  styleUrls: ["./add-edit-form.component.scss"],
  animations: [animationTask.headerIn],
})
export class AddEditFormComponent implements OnInit, OnDestroy {
  addContact: FormGroup;
  eventModel: Event;
  formChanges: Subscription;
  succesfullEvent: boolean;
  constructor(private route: Router, public eventService: EventService) {
    this.eventModel = initializeEvent();
    this.addContact = new FormGroup({});
    let eventPropertyList = Object.keys(this.eventModel);
    const user = JSON.parse(sessionStorage.getItem("user"));
    eventPropertyList.forEach((eventName) => {
      this.createForm(eventName, user);
    });
    this.formChanges = this.addContact.valueChanges.subscribe((data) =>
      this.onValueChanged(data)
    );
  }

  private createForm(formName: any, user): void {
    if (this.addContact.contains(formName)) {
      this.addContact.removeControl(formName);
    }
    let newAddedForm = new FormControl("");
    let minLength: number = 2;
    let maxLength: number = 400;
    //We keep our id form of the formgroup clean and without validation
    //so the event form can pass the validations and have an automatic assign of the id when
    //created in our database
    if (formName !== "id") {
      if (formName === "location" || formName === "description") {
        if (formName === "location") {
          maxLength = 25;
        } else {
          minLength = 10;
        }
        newAddedForm.setValidators(Validators.minLength(minLength));
        newAddedForm.setValidators(Validators.maxLength(maxLength));
      }
      newAddedForm.setValidators(Validators.required);
      if (formName === "addedBy") {
        newAddedForm.setValue(user.name);
      }
    }
    this.addContact.addControl(formName, newAddedForm);
  }

  private onValueChanged(changes?: any) {
    if (!this.addContact) {
      return;
    }
    const form = this.addContact;
    for (const field in this.eventModel) {
      this.eventModel[field] = ""; // clears previous error messages if any
      const control = form.get(field);
      if (control && control.touched && !control.valid) {
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
            if (
              control.hasError(completeKey) ||
              (field === "date" && control.hasError("matDatepickerParse"))
            ) {
              success = false;
            }
          }
          if (!success) {
            this.eventModel[field] = validationMessages[key];
          }
        }
      }
    }
  }

  public onSubmit() {
    if (!this.addContact) {
      return;
    }
    const success = this.eventService
      .addEvent(this.addContact)
      .subscribe(
        (res: any) => {
          console.log(res);
          if (res["id"]) {
            this.succesfullEvent = true;
            this.addContact.reset("");
            let eventPropertyList = Object.keys(this.eventModel);
            eventPropertyList.forEach((event) => {
              this.addContact.get(event).updateValueAndValidity();
            });
            // this.route.navigate(["/events", "event-list"]);
          }
        },
        (err) => {
          this.eventService.errMess = err;
          this.eventService.errorBoolean = true;
        }
      )
      .add(() => {
        //Finish petition mark for the user view whenever its succesfull or not
        this.eventService.onPetition = false;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    //Avoid the memory leak from the valueChanges of the form
    if (this.formChanges) {
      this.formChanges.unsubscribe();
    }
  }
}
