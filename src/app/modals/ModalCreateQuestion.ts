import { CommonModule } from "@angular/common";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import { Question } from "../models/question";
import { Theme } from "../models/theme";
import { AuthService } from "../servises/auth.service";


const API_URL: string = environment.apiUrl;

@Component({
	selector: 'ngbd-modal-create-question',
	standalone: true,
    imports: [CommonModule],
	encapsulation: ViewEncapsulation.None,
	template: `
        <div class="modal-header">
            <h4 class="modal-title">Создание вопроса</h4>
        </div>
        <div class="modal-body">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Текст вопроса" id="textQuestion">
            </div>
            <div class="input-group mb-3">
                <select class="form-select" id="themeSelect">
                    <option *ngFor="let t of themes; let k = index" value="{{t.id}}">{{t.title}}</option>
                </select>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-success" aria-label="Close" (click)="continue()">Создать</button>
            <button type="button" class="btn btn-danger" aria-label="Close" (click)="quit()">Закрыть</button>
        </div>
    `,
})
export class ModalCreateQuestion {

    ticket_id !: number;
    themes!: Array<Theme>;

	constructor(private modalService: NgbActiveModal, private http : HttpClient) {
        this.http.get<any>(API_URL + '/api/theme/getAll', AuthService.getJwtHeader())
            .subscribe((result: any) => {this.themes = result;},(error: HttpErrorResponse) => {console.log(error.error);});
    }
    
    continue () {
        let question = new Question("");
        question.id = this.ticket_id;
        question.text = (document.getElementById("textQuestion") as HTMLInputElement).value;

        this.http.post<any>(API_URL + '/api/question/create', question, AuthService.getJwtHeader())
        .subscribe((result: any) => {
            question.text = result.id;
            question.id = parseInt((document.getElementById("themeSelect") as HTMLSelectElement).value);
            this.http.post<any>(API_URL + '/api/theme/link', question, AuthService.getJwtHeader())
            .subscribe((result: any) => {},(error: HttpErrorResponse) => {console.log(error.error);});
        },(error: HttpErrorResponse) => {console.log(error.error);});

        this.modalService.close("NO");
    }

    quit () {
        this.modalService.close("YES");
    }
}