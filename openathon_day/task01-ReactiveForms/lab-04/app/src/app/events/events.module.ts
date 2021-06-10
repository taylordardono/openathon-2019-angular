import { NgModule } from "@angular/core";

//Modules
import { SharedModule } from "../shared/shared.module";
import { CustomersRoutingModule } from "./event-routing.module";

// Components
import { EventListComponent } from "./event-list/event-list.component";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { AddEditFormComponent } from "./add-edit-form/add-edit-form.component";

@NgModule({
  imports: [SharedModule, CustomersRoutingModule],
  declarations: [
    EventListComponent,
    EventDetailsComponent,
    AddEditFormComponent,
  ],
})
export class EventsModule {}
