import {Component, Input, OnInit, Type, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'ng-modal-confirm',
  template: `
  <div class="modal-header">
    <h5 class="modal-title" id="modal-title">Calculation Result</h5>
    <button type="button" class="btn close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">×</span>
    </button>
  </div>
  <div class="modal-body">
    <p>Are you sure you wa</p>
  </div>
  <div class="modal-footer">
    <button type="button" ngbAutofocus class="btn btn-success" (click)="modal.close('Ok click')">OK</button>
  </div>
  `,
})

export class NgModalConfirm {
  constructor(public modal: NgbActiveModal) { }
}

const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  form: victimForm = new victimForm();
  isSubmitted = false;

  @ViewChild("victimForm")
  victimForm!: NgForm;

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
  }

  calculate(isValid: any) {
    this.isSubmitted = true;
    if(isValid) {
      const value: Array<{
        ageAtDeath: number;
        yearOfDeath: number;
      }> = [];
      const firstVictim = { ageAtDeath: this.form.firstVictimAgeAtDeath, yearOfDeath: this.form.firstVictimYearOfDeath};
      value.push(firstVictim);
      const secondVictim = {ageAtDeath: this.form.secondVictimAgeAtDeath, yearOfDeath: this.form.secondVictimYearOfDeath};
      value.push(secondVictim);
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        observe: "response" as 'body'
      };
      this.httpClient.post(
        "http://localhost:8080/api/village/calculateaverage",
        value,
        httpOptions)
        .subscribe(async (data: any)=> {
          console.log('data', data.body);
        });
    }
  }
}

export class victimForm {
  firstVictimAgeAtDeath: number = 0;
  firstVictimYearOfDeath: number = 0;
  secondVictimAgeAtDeath: number = 0;
  secondVictimYearOfDeath: number = 0;
}
