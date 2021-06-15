import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LandingPageComponent } from "./landing-page/landing-page.component";
import { ProfileComponent } from "./profile/profile.component";
import { LoginComponent } from "./login/login.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { SignupComponent } from "./login/signup/signup.component";

// Guards
import { EventsGuardGuard } from "./core/events-guard.guard";
import { ParentComponent } from "./parent/parent.component";
import { CopyrightComponent } from "./copyright/copyright.component";

const routes: Routes = [
  { path: "home", component: LandingPageComponent },
  {
    path: "events",
    loadChildren: () =>
      import("./events/events.module").then((m) => m.EventsModule),
    canActivate: [EventsGuardGuard],
  },
  {
    path: "profile",
    component: ProfileComponent,
  },
  {
    path: "c",
    component: CopyrightComponent,
  },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "parent", component: ParentComponent },
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
