import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LandingPageComponent } from "./landing-page/landing-page.component";
import { EventListComponent } from "./events/event-list/event-list.component";
import { ProfileComponent } from "./profile/profile.component";
import { LoginComponent } from "./login/login.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { AddEditFormComponent } from "./events/add-edit-form/add-edit-form.component";
import { EventsGuardGuard } from "./core/events-guard.guard";
import { EventDetailsComponent } from "./events/event-details/event-details.component";
import { SignupComponent } from "./login/signup/signup.component";

const routes: Routes = [
  { path: "home", component: LandingPageComponent },
  {
    path: "events/add-event/:id",
    component: AddEditFormComponent,
    canActivate: [EventsGuardGuard],
  },
  {
    path: "events/add-event",
    component: AddEditFormComponent,
    canActivate: [EventsGuardGuard],
  },
  {
    path: "events/event-list",
    component: EventListComponent,
    canActivate: [EventsGuardGuard],
  },
  {
    path: "events/:id",
    component: EventDetailsComponent,
    canActivate: [EventsGuardGuard],
  },
  { path: "profile", component: ProfileComponent, canActivate: [EventsGuardGuard] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },

  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
  providers: [EventsGuardGuard],
})
export class AppRoutingModule {}
