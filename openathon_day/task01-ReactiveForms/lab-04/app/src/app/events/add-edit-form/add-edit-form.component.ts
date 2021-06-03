import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Event, initializeEvent } from "../../models/event";
import { validationMessages } from "../../../environments/environment";
import { Subscription } from "rxjs";
import {EventService} from "src/app/core/event.service";
import {animationTask} from "src/app/shared/animations/animations";

@Component({
  selector: "oevents-add-edit-form",
  templateUrl: "./add-edit-form.component.html",
  styleUrls: ["./add-edit-form.component.scss"],
  animations: [animationTask]
})
export class AddEditFormComponent implements OnInit, OnDestroy {
  addContact: FormGroup;
  eventModel: Event;
  formChanges: Subscription;
  constructor(public eventService: EventService) {
    this.eventModel = initializeEvent();
    this.addContact = new FormGroup({});
    let eventPropertyList = Object.keys(this.eventModel);
    eventPropertyList.forEach((eventName) => {
      this.createForm(eventName);
    });
    this.formChanges = this.addContact.valueChanges.subscribe((data) => this.onValueChanged(data));
  }

  private createForm(formName: any): void {
    if (this.addContact.contains(formName)) {
      this.addContact.removeControl(formName);
    }
    let newAddedForm = new FormControl("");
    let minLength: number = 2;
    let maxLength: number = 400;
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
    this.addContact.addControl(formName, newAddedForm);
  }

  private onValueChanged(changes?: any) {
    if (!this.addContact) {
      return;
    }
    const form = this.addContact;
    for (const field in this.eventModel) {
      //We are not using date property, wich is a Date type object, so, we will use
      //try catch method until we decide what we should do with the date property
      try {
        this.eventModel[field] = ""; // clears previous error messages if any
      } catch (error) {}
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
            if (control.hasError(completeKey)) {
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

  // getErrorMessage(formName: string): string {
  //   let errorMessage: string = "";
  //   if (this.addContact.get(formName).hasError("required")) {
  //     errorMessage = validationMessages.required;
  //   } else {
  //     if (
  //       this.addContact.get(formName).hasError("minlength") ||
  //       this.addContact.get(formName).hasError("maxlength")
  //     ) {
  //       errorMessage = validationMessages.length;
  //     }
  //   }
  //   this.eventModel[formName] = errorMessage;
  //   console.log(this.eventModel[formName]);
  //   console.log(errorMessage);
  //   return errorMessage;
  // }

  sendedData: boolean = false;
  public onSubmit() {
    let eventPropertyList = Object.keys(this.eventModel);
    //As a test, we will use timeOut function below to assume the time delay between sending the forms data until
    //the data has reach our database
    this.sendedData = true;
    eventPropertyList.forEach((eventName) => {
      this.addContact.get(eventName).setValue("");
      this.addContact.get(eventName).markAsPristine();
      this.addContact.get(eventName).markAsUntouched();
      //We are not using date property, wich is a Date type object, so, we will use
      //try catch method until we decide what we should do with the date property
      try {
        this.eventModel[eventName] = "";
      } catch (error) {}
      setTimeout(() => {
        this.sendedData = false;
      }, 1500);
    });
  }

  ngOnInit(): void {
    console.log(this.addContact);
    // let test = {
    //   test: "test",
    //   numer: 0
    // }
    // let file = new Blob([JSON.stringify(test)], {type: "json"});
    // let downLoadUrl = window.URL.createObjectURL(file);
    // window.open(downLoadUrl);
  }

  ngOnDestroy(): void {
    //Avoid the memory leak from the valueChanges of the form
    if (this.formChanges) {
      this.formChanges.unsubscribe();
    }
  }
}
