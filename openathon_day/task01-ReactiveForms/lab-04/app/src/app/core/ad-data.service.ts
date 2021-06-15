import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ErrorService } from "./error.service";
import { Ad } from "../models/ad.model";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { retry, catchError } from "rxjs/operators";

//common headers for adtService
export const headers = new HttpHeaders({
  "Content-Type": "application/json",
});

@Injectable({
  providedIn: "root",
})
export class AdDataService {
  loadedAds: Array<Ad> = [];
  constructor(private errorService: ErrorService, private http: HttpClient) {}
  setAds() {
    this.getAds().subscribe((ads: Ad[]) => {
      this.loadedAds = ads;
      console.log(this.loadedAds);
    });
  }
  getAds(): Observable<any> {
    const url = environment.apiURL + "ads";
    return this.http
      .get(url, { headers })
      .pipe(retry(3), catchError(this.errorService.handleError));
  }
}
