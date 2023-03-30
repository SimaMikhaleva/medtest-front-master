import { Component, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from '../servises/auth.service';

const API_URL: string = environment.apiUrl;

@Component({
	selector: 'ngbd-modal-content',
	standalone: true,
	template: `
		<div class="modal-header">
			<h4 class="modal-title">Изучение материала темы</h4>
			<button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss('Cross click')"></button>
		</div>
		<div class="modal-body">
      <div>
        {{text}}
      </div>
		</div>
		<div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="choiseMethod()">{{this.textButton}}</button>
			<button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Закрыть</button>
		</div>
	`,
})
export class ModalThemeLearn {
  @Input() text : any;
  @Input() id : any;
  @Input() learned : any;
  textButton : any;

	constructor(private http : HttpClient, public activeModal: NgbActiveModal) {}

  ngOnInit() {
    if (this.learned) {
      this.textButton = 'Отменить пометку "Изучено"';
    } else {
      this.textButton = 'Изучено';
    }
  }

  choiseMethod() {
    if (this.learned) {
      this.unlearnTheme();
    } else {
      this.learnTheme();
    }
  }

  learnTheme() {
    this.http.get<any>(API_URL + '/api/theme/learnTheme/'+this.id, AuthService.getJwtHeader())
    .subscribe(
      (result: any) => {
        this.activeModal.close('Close click');
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  unlearnTheme() {
    this.http.get<any>(API_URL + '/api/theme/unlearnTheme/'+this.id, AuthService.getJwtHeader())
    .subscribe(
      (result: any) => {
        this.activeModal.close('Close click');
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }
}