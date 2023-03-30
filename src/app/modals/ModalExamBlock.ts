import { Component, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../servises/auth.service';
import { Answer } from '../models/answer';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

const API_URL: string = environment.apiUrl;

@Component({
	selector: 'modal-exam-block',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./modalStyles/ModalTicketTest.css'],
	template: `
    <ng-container *ngIf="expired">
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <button type="button" class="btn btn-primary" (click)="redirectAfterExpired()">Перезагрузите страницу</button>
            <p style="text-align: center;">
                Кажется ваша предыдущая сессия была внезапно прервана, результаты были записаны на момент выхода
            </p>
        </div>
    </ng-container>
    <ng-container *ngIf="!started && !expired">
        <div style="display: flex; justify-content: center; align-items: center; flex-direction: column;">
            <button type="button" class="btn btn-primary" (click)="start()">Начать попытку</button>
            <p style="text-align: center;">
                У вас будет 20 минут на 20 случайных вопросов.
                <br>Экзамен закончится досрочно, если вы не уложитесь в заданное время.
                <br>Не выключайте вкладку и не переходите на другие разделы в процессе прохождения.
            </p>
        </div>
    </ng-container>
    <ng-container *ngIf="started && !expired">
		<ng-container *ngIf="questionsList.length == 0">
            <p style="text-align: center;">Пока что вопросов нет.</p>
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
                <div id="timer">
                    <img src="https://img.icons8.com/windows/32/null/time.png"/>
                    <div id="remainingTime"></div>
                </div>
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
    </ng-container>
	`,
})
export class ModalExamBlock {
    @Input() questionsList : any;
    currentQuestionId: number;
    finished: boolean;
    fav!: boolean;
    correctAnswers: number;
    started: boolean;
    expired: boolean;
    startTime!: Date;

    constructor(private http : HttpClient,
        private router: Router) {
        this.currentQuestionId = 0;
        this.correctAnswers = 0;
        this.finished = false;
        this.started = false;
        this.expired = false;
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

    redirectAfterExpired() {
        this.finished = true;

        this.questionsList[this.currentQuestionId].status = 'FALSE';
        this.http.post<any>(API_URL + '/api/question/answer', this.questionsList , AuthService.getJwtHeader())
        .subscribe((result: any) => {this.router.navigate(['/profile']).then(() => {window.location.reload();});},(error: HttpErrorResponse) => {console.log(error.error);});
    }

    toMain() {
        this.router.navigate(['/profile']).then(() => {window.location.reload();});
    }

    start() {
        this.finished = false;
        this.started = true;
        this.startTime = new Date();

        let timer = 20 * 1; // * 20 min * 60
        let displayMin, displaySec;
        setInterval( () => {
            let minutes = timer / 60;
            let seconds = timer % 60;

            displayMin = minutes < 10 ? "0" + Math.floor(minutes) : Math.floor(minutes);
            displaySec = seconds < 10 ? "0" + Math.floor(seconds) : Math.floor(seconds);

            document.getElementById("remainingTime")!.innerHTML = displayMin + ":" + displaySec;

            if (--timer < 0) {
                document.getElementById("remainingTime")!.innerHTML = "EXPIRED";
                this.finished = true;
                this.questionsList[this.currentQuestionId].status = 'FALSE';
                this.http.post<any>(API_URL + '/api/question/answer', this.questionsList , AuthService.getJwtHeader())
                .subscribe((result: any) => {console.log(result);},(error: HttpErrorResponse) => {console.log(error.error);});
            }
        }, 1000);

        this.http.post<any>(API_URL + '/api/question/runExam', "" , AuthService.getJwtHeader())
        .subscribe((result: any) => {
            console.log(result);
        },
        (error: HttpErrorResponse) => {
            this.expired = true;
            return;
        });
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