import { Component, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../servises/auth.service';
import { Answer } from '../models/answer';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

const API_URL: string = environment.apiUrl;

@Component({
	selector: 'modal-favorite-block',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./modalStyles/ModalTicketTest.css'],
	template: `
		<ng-container *ngIf="questionsList.length == 0">
            <p style="text-align: center;">Здесь появятся вопросы, маркированные как избранные.</p>
        </ng-container>
        <ng-container *ngIf="questionsList.length != 0">
            <div id="ticketModal">
                <span id="qNum">
                    <div class="qNumE" *ngFor="let q of questionsList; let i = index">
                        <div *ngIf="q.status == 'NOTANSWERED'" class="qNumE0">{{i+1}}</div>
                        <div *ngIf="q.status == 'CURRENT'" class="qNumE1">{{i+1}}</div>
                        <div *ngIf="q.status == 'FALSE'" class="qNumE2">{{i+1}}</div>
                        <div *ngIf="q.status == 'TRUE'" class="qNumE3">{{i+1}}</div>
                    </div>
                </span>
            </div>
            <hr>
            <ng-container *ngIf="!finished">
                <div id="qText">
                    {{questionsList[currentQuestionId].text}}
                </div>
                <div id="qAnswers">
                    <div class="answer" *ngFor="let a of questionsList[currentQuestionId].answers; let i = index" (click)="answer(a.id)">{{a.text}}</div>
                </div>
                <span id="qAddToFavorite" (click)="markAsFav()">
                    <ng-container *ngIf="!fav">Добавить в избранное</ng-container>
                    <ng-container *ngIf="fav">Удалить из избранного</ng-container>
                </span>
            </ng-container>
            <ng-container *ngIf="finished">
                <div id="resultBlock">
                    <div id="result">{{correctAnswers}}/{{questionsList.length}}</div>
                    <div *ngIf="correctAnswers == questionsList.length" id="resultAdvice">ОТЛИЧНО</div>
                    <div *ngIf="correctAnswers != questionsList.length" id="resultAdvice">ТРЕНИРУЙТЕСЬ</div>
                    <button *ngIf="correctAnswers != questionsList.length" type="button" class="btn btn-primary" (click)="redirectToMistakes()">Мои ошибки</button>
                    <button *ngIf="correctAnswers == questionsList.length" type="button" class="btn btn-primary" (click)="toMain()">На главную</button>
                </div>
            </ng-container>
        </ng-container>
	`,
})
export class ModalFavoriteBlock {
    @Input() questionsList : any;
    currentQuestionId: number;
    finished: boolean;
    fav!: boolean;
    correctAnswers: number;

    constructor(private http : HttpClient,
        private router: Router) {
        this.currentQuestionId = 0;
        this.correctAnswers = 0;
        this.finished = false;
    }

    ngOnInit() {
        setTimeout(() => {
            this.questionsList[this.currentQuestionId].status = 'CURRENT';
            this.fav = this.questionsList[this.currentQuestionId].favorite
        }, 200);
    }

    redirectToMistakes() {
        this.router.navigate(['/profile'], { queryParams: {state : 'errors'}}).then(() => {window.location.reload();});
    }

    toMain() {
        this.router.navigate(['/profile']).then(() => {window.location.reload();});
    }

    markAsFav() {
        this.questionsList[this.currentQuestionId].favorite = !this.questionsList[this.currentQuestionId].favorite;
        this.fav = this.questionsList[this.currentQuestionId].favorite;
    }

    answer(id: any) {
        let yourChoise = this.questionsList[this.currentQuestionId].answers as Array<Answer>;
        for (let i = 0; i < yourChoise.length; i++) {
            if (yourChoise[i].id == id) {
                if (this.questionsList[this.currentQuestionId].answers[i].correct) {
                    this.questionsList[this.currentQuestionId].status = 'TRUE';
                    this.correctAnswers++;
                } else {
                    this.questionsList[this.currentQuestionId].status = 'FALSE';
                }
            }
        }
        if (this.currentQuestionId != this.questionsList.length-1) {
            this.currentQuestionId++;
            this.fav = this.questionsList[this.currentQuestionId].favorite;
            this.questionsList[this.currentQuestionId].status = 'CURRENT';
        } else {
            this.finished = true;
            this.http.post<any>(API_URL + '/api/question/answer', this.questionsList , AuthService.getJwtHeader())
                .subscribe((result: any) => {console.log(result);},(error: HttpErrorResponse) => {console.log(error.error);}
            );
        }
    }
}