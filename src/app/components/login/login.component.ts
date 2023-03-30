import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../servises/auth.service';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public formLogin = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
  });
  public hasError?: boolean;
  public errorMsg?: string;

  constructor(private http: HttpClient, 
    private router: Router,
    public fb: FormBuilder,
    private authService: AuthService) { 
    
  }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['/profile']);
    }
    this.hasError = false;
    this.errorMsg = "";
  }

  login() {
    this.http.post<any>(API_URL + '/login', this.formLogin.value)
      .subscribe(
        (result: any) => {
          sessionStorage.setItem('user', JSON.stringify(result));
          this.router.navigate(['/']);
        },
        (error: HttpErrorResponse) => {
          (document.getElementById("password") as HTMLInputElement).value = '';
          this.hasError = true;
          this.errorMsg = error.error;
        }
      );
  }
}
