import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Event, initializeEvent } from "../../models/event.model";
import { validationMessages } from "../../../environments/environment";
import { Subscription } from "rxjs";
import { EventService } from "src/app/core/event.service";
import { ErrorService } from "src/app/core/error.service";
import { oeventsAnimations } from "src/app/shared/animations/animations";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "oevents-add-edit-form",
  templateUrl: "./add-edit-form.component.html",
  styleUrls: ["./add-edit-form.component.scss"],
  animations: [oeventsAnimations.headerIn, oeventsAnimations.listIn],
})
export class AddEditFormComponent implements OnInit, OnDestroy {
  addContact: FormGroup;
  eventModel: Event;
  formChanges: Subscription;
  loadedForm: boolean;
  eventID: String;
  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private errorService: ErrorService
  ) {}

  private createForm(formName: any, user, value?): void {
    if (this.addContact.contains(formName)) {
      this.addContact.removeControl(formName);
    }
    let newAddedForm = new FormControl(value ? value : "");
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

  private checkValidForm(changes?: any) {
    if (!this.addContact) {
      return;
    }
    const form = this.addContact;
    for (const field in this.eventModel) {
      this.eventModel[field] = ""; // clears previous error messages if any
      const control = form.get(field);
      if (control && control.touched && !control.valid) {
        for (const key in validationMessages) {
          let success: boolean = true;
          if (control.hasError(key)) {
            success = false;
          }
          if (!success) {
            this.eventModel[field] = validationMessages[key];
          }
        }
      }
    }
  }

  public setEvent() {
    if (!this.addContact) {
      return;
    }
    //Reset of error/success message and variables
    this.errorService.resetActionStateValues();
    if (this.eventID) {
      this.eventService.editEvent(this.addContact, this.eventID);
    } else {
      this.eventService.addEvent(this.addContact);
    }
  }

  ngOnInit(): void {
    this.loadedForm = false;
    this.eventService.activeEvent = true;
    this.eventModel = initializeEvent();
    this.addContact = new FormGroup({});
    this.eventID = this.activatedRoute.snapshot.params["id"];
    const user = JSON.parse(sessionStorage.getItem("user"));
    let selectedEvent: Event = initializeEvent();
    (async () => {
      //We check if is a new event or the edition of an already created one
      if (this.eventID) {
        this.eventService.events = await new Promise((resolve, reject) => {
          //In case events are not loaded, we load them
          if (!this.eventService.events) {
            this.eventService.getEvents().subscribe(
              (events: Event[]) => {
                resolve(events);
              },
              (err) => {
                reject(err);
              }
            );
          } else {
            //If the events are already loaded, we just simply resolve them
            resolve(this.eventService.events);
          }
        });
        this.eventService.events.forEach((event) => {
          if (event.id === this.eventID) {
            selectedEvent = event;
            return;
          }
        });
      }
      let eventPropertyList = Object.keys(this.eventModel);
      eventPropertyList.forEach((eventName) => {
        this.createForm(eventName, user, selectedEvent[eventName]);
      });
      this.formChanges = this.addContact.valueChanges.subscribe((data) =>
        this.checkValidForm(data)
      );
      this.loadedForm = true;
    })();
  }

  ngOnDestroy(): void {
    this.eventService.activeEvent = false;
    //Avoid the memory leak from the valueChanges of the form
    if (this.formChanges) {
      this.formChanges.unsubscribe();
    }
  }
}
