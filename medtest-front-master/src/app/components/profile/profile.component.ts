import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../servises/auth.service';
import { State } from '../../models/state';
import { Theme } from '../../models/theme';
import { User } from '../../models/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ticket } from '../../models/ticket';
import { ModalThemeLearn } from 'src/app/modals/ModalThemeLearn';
import { ModalTicketTest } from 'src/app/modals/ModalTicketTest';
import { ActivatedRoute } from '@angular/router';
import { TimeService } from 'src/app/servises/time.service';
import { Question } from 'src/app/models/question';
import { Stat } from 'src/app/models/stat';
import { ModalCreateQuestion } from 'src/app/modals/ModalCreateQuestion';
import { ModalCreateAnswer } from 'src/app/modals/ModalCreateAnswer';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../modals/modalStyles/ModalTicketTest.css']
})
export class ProfileComponent implements OnInit {

  parseDate = TimeService.formatDate;

  user!: User;
  themesList!: Array<Theme>;
  ticketsList!: Array<Ticket>;
  questionsList!: Array<Question>;
  statList!: Array<Stat>;
  state?: State = new State("TEST");
  displayState?: string = "";
  progressWidth?: string;

  constructor(private http : HttpClient, 
    private modalService: NgbModal, 
    private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.http.get<any>(API_URL + '/profile', AuthService.getJwtHeader())
    .subscribe(
      (result: any) => {
        this.user = new User(result);

        if (this.user.roles[0].systemName == 'ADMIN') { this.admFeautures(); }
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );

    this.state!.state = "TEST";
    this.route.queryParams
      .subscribe(params => {
        if (params['state'] == "errors") {
          this.state!.state = "ERRORS";
          this.errors();
        }
      });
  }

  //открывашки категорий

  test() {
    (document.getElementById("mainSwitch") as HTMLInputElement).checked = false;
    this.state!.state = "TEST";
  }

  traning() {
    (document.getElementById("mainSwitch") as HTMLInputElement).checked = true;
    this.state!.state = "TRAIN";
    this.http.get<any>(API_URL + '/api/theme/getAll', AuthService.getJwtHeader())
    .subscribe(
      (result: any) => {
        this.themesList = result;
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  swap() {
    if (this.state!.state == "TRAIN") {
      this.test();
    } else {
      this.traning();
    }
  }

  //открывашки пунктов меню

  tickets() {
    this.state!.state = "TICKET";
    this.displayState = "Билеты";
    this.http.get<any>(API_URL + '/api/ticket/getAll', AuthService.getJwtHeader())
    .subscribe(
      (result: any) => {
        this.ticketsList = result;
        let countCorrectTickets = this.ticketsList.filter(e => e.status == "TRUE").length;
        let progressBar = Math.round(countCorrectTickets / this.ticketsList.length * 100);
        this.progressWidth = progressBar + '%';
      },
      (error: HttpErrorResponse) => {
        console.log(error.error);
      }
    );
  }

  themes() {
    this.state!.state = "THEME";
    this.displayState = "Темы";
    this.http.get<any>(API_URL + '/api/theme/getAll', AuthService.getJwtHeader())
    .subscribe((result: any) => {this.themesList = result;},(error: HttpErrorResponse) => {console.log(error.error);});
  }

  errors() {
    this.state!.state = "ERROR";
    this.displayState = "Ошибки";
    this.http.get<any>(API_URL + '/api/question/getErrors', AuthService.getJwtHeader())
    .subscribe((result: any) => {this.questionsList = result;},(error: HttpErrorResponse) => {console.log(error.error);});
  }

  exam() {
    this.state!.state = "EXAM";
    this.displayState = "Экзамен";
    this.http.get<any>(API_URL + '/api/question/getExam', AuthService.getJwtHeader())
    .subscribe((result: any) => {this.questionsList = result;},(error: HttpErrorResponse) => {console.log(error.error);});
  }

  marathon() {
    this.state!.state = "MARATHON";
    this.displayState = "Марафон";
    this.http.get<any>(API_URL + '/api/question/getMarathon', AuthService.getJwtHeader())
    .subscribe((result: any) => {this.questionsList = result;},(error: HttpErrorResponse) => {console.log(error.error);});
  }

  favorites() {
    this.state!.state = "FAVORITE";
    this.displayState = "Избранное";
    this.http.get<any>(API_URL + '/api/question/getFavorite', AuthService.getJwtHeader())
    .subscribe((result: any) => {this.questionsList = result;},(error: HttpErrorResponse) => {console.log(error.error);});
  }

  //открывашки модальных окон
  openThemeLearnModal(text : any, id : any, learned: any) {
    const modalRef = this.modalService.open(ModalThemeLearn, {size: 'xl'});
		modalRef.componentInstance.text = text;
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.learned = learned;
    modalRef.result.then((result) => {if (result) { this.traning() }});
  }

  openTicketTestModal(ticket : any) {
    const modalRef = this.modalService.open(ModalTicketTest, {fullscreen: true});
    modalRef.componentInstance.ticket = ticket;
    modalRef.result.then((result) => {if (result) { this.tickets() }});
  }

  //служебный метод
  fancyTimeFormat(duration: number) {
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
  
    let ret = "";
  
    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
  
    ret += "" + mins + " мин ";
    ret += "" + secs + " сек";
  
    return ret;
  }

  admFeautures() {
    this.http.get<any>(API_URL + '/stat', AuthService.getJwtHeader()).subscribe((result: any) => {this.statList = result; },(error: HttpErrorResponse) => { console.log(error.error);});
    this.http.get<any>(API_URL + '/api/ticket/getAll', AuthService.getJwtHeader()).subscribe((result: any) => {this.ticketsList = result;},(error: HttpErrorResponse) => {console.log(error.error);});
  }

  createTicket() {
    this.http.post<any>(API_URL + '/api/ticket/create', null, AuthService.getJwtHeader())
      .subscribe((result: any) => {this.admFeautures()},(error: HttpErrorResponse) => {console.log(error.error);});
  }

  deleteTicket(id: number) {
    this.http.delete<any>(API_URL + '/api/ticket/delete/'+id, AuthService.getJwtHeader())
      .subscribe((result: any) => {this.admFeautures()},(error: HttpErrorResponse) => {console.log(error.error);});
  }

  createQuestion(id: number) {
    const modalRef = this.modalService.open(ModalCreateQuestion);
    modalRef.componentInstance.ticket_id = id;
    modalRef.result.then((result) => {this.admFeautures()});
  }

  deleteQuestion(id: number) {
    this.http.delete<any>(API_URL + '/api/question/delete/'+id, AuthService.getJwtHeader())
      .subscribe((result: any) => {this.admFeautures()},(error: HttpErrorResponse) => {console.log(error.error);});
  }

  createAnswer(id: number) {
    const modalRef = this.modalService.open(ModalCreateAnswer);
    modalRef.componentInstance.question_id = id;
    modalRef.result.then((result) => {this.admFeautures()});
  }

  deleteAnswer(id: number) {
    this.http.delete<any>(API_URL + '/api/answer/delete/'+id, AuthService.getJwtHeader())
      .subscribe((result: any) => {this.admFeautures()},(error: HttpErrorResponse) => {console.log(error.error);});
  }
}