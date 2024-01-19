import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {EditPatientComponent} from "./edit-patient/edit-patient.component";
import {AddPatientComponent} from "./add-patient/add-patient.component";

const routes: Routes = [
  {path: '', redirectTo: 'Home', pathMatch: 'full'},
  {path: 'Home', component: HomeComponent},
  {path: 'EditPatient/:patientId', component: EditPatientComponent},
  {path: 'AddPatient', component: AddPatientComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
