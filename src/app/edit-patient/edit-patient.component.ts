import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpProviderService} from "../service/http-provider.service";
import {ToastrService} from "ngx-toastr";
import {NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[2], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[0], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + ('0' + date.month).slice(-2) + this.DELIMITER + ('0' + date.day).slice(-2) : '';
  }
}

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '-';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[2], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[0], 10),
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? date.year + this.DELIMITER + ('0' + date.month).slice(-2) + this.DELIMITER + ('0' + date.day).slice(-2) : '';
  }
}
@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class EditPatientComponent implements OnInit {
  addPatientForm: patientForm = new patientForm();
  suburbList: any = [];
  stateList: any = [];
  patient: any = {};
  genderList: any = [
    {id: "Male", name: "Male"},
    {id: "Female", name: "Female"}
  ];

  @ViewChild("patientForm")
  patientForm!: NgForm;

  isSubmitted: boolean = false;
  patientId: number = 0;

  constructor(private router: Router, private httpProvider: HttpProviderService, private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.patientId = this.route.snapshot.params['patientId'];
    this.getPatientById(this.patientId);
    this.getAllSuburb();
    this.getAllState();
  }

  async getAllSuburb() {
    this.httpProvider.getAllSuburb().subscribe((data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData) {
            console.log(resultData);
            this.suburbList = resultData;
          }
        }
      },
      (error : any)=> {
        if (error) {
          if (error.status == 404) {
            if(error.error && error.error.message){
              this.suburbList = [];
            }
          }
        }
      });
  }

  async getPatientById(patientId: number) {
    this.httpProvider.getPatientById(patientId).subscribe((data: any) => {
      if(data != null && data.body != null) {
        var resultData = data.body;
        if (resultData) {
          this.patient = resultData;
          console.log('patient', this.patient);
          this.addPatientForm.id = this.patient.id;
          this.addPatientForm.firstName = this.patient.firstName;
          this.addPatientForm.lastName = this.patient.lastName;
          this.addPatientForm.dayOfBirth = this.patient.dayOfBirth;
          this.addPatientForm.gender = this.patient.gender;
          this.addPatientForm.phoneNumber = this.patient.phoneNumber;
          this.addPatientForm.suburbId = this.patient.suburb.id;
          this.addPatientForm.stateId = this.patient.state.id;
          this.addPatientForm.address = this.patient.address;
          this.addPatientForm.postCode = this.patient.postCode;
        }
      }
    });
  }

  async getAllState() {
    this.httpProvider.getAllState().subscribe((data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData) {
            this.stateList = resultData;
          }
        }
      },
      (error : any)=> {
        if (error) {
          if (error.status == 404) {
            if(error.error && error.error.message){
              this.stateList = [];
            }
          }
        }
      });
  }

  updatePatient(isValid: any) {
    this.isSubmitted = true;
    console.log(this.addPatientForm);
    if (isValid) {
      this.httpProvider.updatePatient(this.addPatientForm).subscribe(async data => {
          if (data != null && data.body != null) {
            var resultData = data.body;
            console.log(resultData);
            if (resultData != null && resultData.id >= 0) {
              this.toastr.success(resultData.message);
              setTimeout(() => {
                this.router.navigate(['/Home']);
              }, 500);
            }
          }
        },
        async error => {
          this.toastr.error(error.message);
          setTimeout(() => {
            this.router.navigate(['/Home']);
          }, 500);
        });
    }
  }
}

export class patientForm {
  id: string = "";
  firstName: string = "";
  lastName: string = "";
  gender: string = "";
  dayOfBirth: string = "";
  address: string = "";
  suburbId: string = "";
  stateId: string = "";
  phoneNumber: string = "";
  postCode: string = "";
}
