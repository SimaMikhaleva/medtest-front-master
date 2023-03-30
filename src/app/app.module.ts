import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ModalErrorBlock } from "./modals/ModalErrorBlock";
import { ModalThemeBlock } from "./modals/ModalThemeBlock";
import { ModalFavoriteBlock } from "./modals/ModalFavoriteBlock";
import { ModalMarathonBlock } from "./modals/ModalMarathonBlock";
import { ModalExamBlock } from "./modals/ModalExamBlock";
import { ModalCreateQuestion } from './modals/ModalCreateQuestion';
import { ModalCreateAnswer } from './modals/ModalCreateAnswer';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CommonModule,
        ModalErrorBlock,
        ModalThemeBlock,
        ModalFavoriteBlock,
        ModalMarathonBlock,
        ModalExamBlock,
        ModalCreateQuestion,
        ModalCreateAnswer
    ]
})
export class AppModule { }
