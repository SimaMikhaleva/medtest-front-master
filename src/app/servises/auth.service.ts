import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient : HttpClient,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isUserLoggedIn()){
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }

  isUserLoggedIn() {
    let user = JSON.parse(sessionStorage.getItem('user')!);
    return !(user === null);
  }

  logOut() {
    sessionStorage.removeItem('user');
    this.router.navigate(['']);
  }

  static getCurrentUser() : string{
    return sessionStorage.getItem('user')!;
  }

  static getJwtHeader() {
    return {headers: {'Content-Type':'application/json','Authorization':"Bearer " + JSON.parse(sessionStorage.getItem('user')!).token}};
  }
  static getJwtHeaderPlain() {
    return {headers: {'Authorization':"Bearer " + JSON.parse(sessionStorage.getItem('user')!).token}};
  }
}
