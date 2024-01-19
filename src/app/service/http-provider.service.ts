import { Injectable } from '@angular/core';
import {WebApiService} from "./web-api.service";
import {Observable} from "rxjs";

var apiUrl = "http://localhost:8080";
// var apiUrl = "/url"

var httpLink = {
  suburbUrl: apiUrl + "/api/suburb",
  stateUrl: apiUrl + "/api/state",
  patientUrl: apiUrl + "/api/patient"
}

@Injectable({
  providedIn: 'root'
})
export class HttpProviderService {

  constructor(private webApiService: WebApiService) { }

  public getAllSuburb(): Observable<any> {
    return this.webApiService.get(httpLink.suburbUrl);
  }

  public getAllState(): Observable<any> {
    return this.webApiService.get(httpLink.stateUrl);
  }

  public getAllPatient(): Observable<any> {
    return this.webApiService.get(httpLink.patientUrl);
  }

  public savePatient(model: any): Observable<any> {
    return this.webApiService.post(httpLink.patientUrl, model);
  }

  public deletePatientById(model: any): Observable<any> {
    return this.webApiService.delete(httpLink.patientUrl + '/' + model.id);
  }

  public getPatientById(patientId: number): Observable<any> {
    return this.webApiService.get(httpLink.patientUrl + '/' + patientId);
  }

  public updatePatient(model: any): Observable<any> {
    return this.webApiService.update(httpLink.patientUrl, model);
  }

  public getPatientPage(page: number, size: number) {
    return this.webApiService.get(httpLink.patientUrl + '/page?page=' + page + '&size=' + size);
  }
}
