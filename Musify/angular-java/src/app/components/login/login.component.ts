import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoutePaths } from '../../app.routes';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { CookieUtils } from '../../core/utils/cookie-utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule, MatButtonModule],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email = '';
  password = '';
  serverErrorMessage: string = '';

  constructor(private router: Router,
    private authService: AuthService
  ) { }

  deleteCookie(name: string) {
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  }

  ngOnInit() {
    this.deleteCookie("jwtToken");
  }

  markAllFieldsAsTouched(form: any) {
    Object.values(form.controls).forEach((control: any) => {
      control.markAsTouched();
    });
  }

  onSubmit(form: any) {
    if (form.invalid) {
      this.markAllFieldsAsTouched(form);
      return;
    }
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        CookieUtils.setCookie("jwtToken", response.token, 5);
        this.serverErrorMessage = '';
        console.log(response.token);
        CookieUtils.setCookie("jwtToken", response.token, 5);
        console.log(response.token);
        this.router.navigate([RoutePaths.home]);
      },
      error: (err) => {
        console.error('Login error:', err);

        if (typeof err.error === 'string') {
          this.serverErrorMessage = err.error;
        } else if (err.error?.message) {
          this.serverErrorMessage = err.error.message;
        } else {
          this.serverErrorMessage = 'Login failed. Please try again';
        }
      }
    })
  }

  goToRegister() {
    this.router.navigate([RoutePaths.register]);
  }
}
