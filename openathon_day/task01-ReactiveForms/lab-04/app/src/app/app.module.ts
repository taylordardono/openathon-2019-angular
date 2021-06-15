import { NgModule, CUSTOM_ELEMENTS_SCHEMA, Inject } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// Modules
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { LoginModule } from "./login/login.module";
import { ProfileModule } from "./profile/profile.module";

// Components
import { AppComponent } from "./app.component";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { ErrorCardComponent } from "./error-card/error-card.component";

//Provider across the application
import { ErrorService } from "./core/error.service";
import { ErrorServiceMock } from "./core/error-mock.service";
import { UserDataService } from "./core/user-data.service";
import { ParentComponent } from "./parent/parent.component";
import { ChildComponent } from "./parent/child/child.component";
@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ToolbarComponent,
    PageNotFoundComponent,
    ErrorCardComponent,
    ParentComponent,
    ChildComponent,
  ],
  imports: [
    CoreModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    LoginModule,
    ProfileModule,
  ],
  providers: [
    { provide: ErrorService, useClass: ErrorService },
    UserDataService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
