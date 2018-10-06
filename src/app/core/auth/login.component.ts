import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router, private auth: AuthService) {}

  googleLogin() {
    this.auth.googleLogin().then(() => {
      this.router.navigateByUrl('/');
    });
  }
}
