import { Component } from '@angular/core';
import { AuthService } from './servises/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'medtest-front';

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logOut();
  }
}
