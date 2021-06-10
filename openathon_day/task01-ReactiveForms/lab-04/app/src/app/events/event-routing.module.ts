import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Components
import { EventListComponent } from "./event-list/event-list.component";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { AddEditFormComponent } from "./add-edit-form/add-edit-form.component";

const routes: Routes = [
  {
    path: "add-event/:id",
    component: AddEditFormComponent
  },
  {
    path: "add-event",
    component: AddEditFormComponent
  },
  {
    path: "event-list",
    component: EventListComponent
  },
  {
    path: ":id",
    component: EventDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
