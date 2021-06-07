import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";

import { EventService } from "./event.service";
import { UserDataService } from "./user-data.service";

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [EventService, UserDataService]
})
export class CoreModule {}
