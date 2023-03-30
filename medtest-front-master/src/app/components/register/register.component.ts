import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../servises/auth.service';

const API_URL: string = environment.apiUrl;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public hasError?: boolean;
  public errorMsg?: string;

  formRegister = new FormGroup({
    name: new FormControl(''),
    login: new FormControl(''),
    password: new FormControl(''),
    passwordAccept: new FormControl('')
  });

  constructor(private http: HttpClient, 
    private router: Router,
    public fb: FormBuilder,
    private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['/profile']);
    }
    this.hasError = false;
    this.errorMsg = "";
  }

  auth(): void {
    this.register(this.formRegister)
      .subscribe(
        (result: any) => {
          this.router.navigate(['/login']);
          console.log(result);
        },
        (error: HttpErrorResponse) => {
          this.hasError = true;
          this.errorMsg = error.error;
          console.log(error.error);
        }
      );
  }

  register(form: FormGroup): Observable<any> {
    return this.http.post<any>(API_URL + '/register', form.value);
  }

}
