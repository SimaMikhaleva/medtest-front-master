import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import { Answer } from "../models/answer";
import { Question } from "../models/question";
import { AuthService } from "../servises/auth.service";


const API_URL: string = environment.apiUrl;

@Component({
    selector: 'ngbd-modal-create-answer',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    template: `
        <div class="modal-header">
            <h4 class="modal-title">Создание ответа</h4>
        </div>
        <div class="modal-body">
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Текст ответа" id="textAnswer">
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="correctAnswer">
                <label class="form-check-label" for="correctAnswer">
                    Корректность ответа
                </label>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-success" aria-label="Close" (click)="continue()">Создать</button>
            <button type="button" class="btn btn-danger" aria-label="Close" (click)="quit()">Закрыть</button>
        </div>
    `,
})
export class ModalCreateAnswer {

    question_id !: number;

    constructor(private modalService: NgbActiveModal,
        private http: HttpClient) { }

    continue() {
        let answer = new Answer("");
        answer.id = this.question_id;
        answer.text = (document.getElementById("textAnswer") as HTMLInputElement).value;
        answer.correct = (document.getElementById("correctAnswer") as HTMLInputElement).checked;

        this.http.post<any>(API_URL + '/api/answer/create', answer, AuthService.getJwtHeader())
            .subscribe((result: any) => { }, (error: HttpErrorResponse) => { console.log(error.error); });

        this.modalService.close("NO");
    }

    quit() {
        this.modalService.close("YES");
    }
}