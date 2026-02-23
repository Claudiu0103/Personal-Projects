import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RoutePaths } from '../../app.routes';
import { CookieUtils } from '../../core/utils/cookie-utils';

@Component({
selector: 'app-register',
standalone: true,
imports: [CommonModule, FormsModule],
templateUrl: './register.component.html',
styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
firstName = '';
lastName = '';
email = '';
country = '';
password = '';
confirmPassword = '';
serverErrorMessage: string = '';
constructor(private router: Router,
            private authService: AuthService
) {}

deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}

ngOnInit(){
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

const user = {
  firstName: this.firstName,
  lastName: this.lastName,
  email: this.email,
  country: this.country,
  password: this.password,
};

this.authService.register(
  user.firstName,
  user.lastName,
  user.email,
  user.country,
  user.password
).subscribe({
  next: (response) => {
    console.log(response.token);
    this.serverErrorMessage ='';
    CookieUtils.setCookie("jwtToken", response.token, 5);
    console.log(response.token);
    this.router.navigate([RoutePaths.home]);
  },
  error: (err) => {
console.error('Registration error:', err);

if (typeof err.error === 'string') {
  this.serverErrorMessage = err.error;
} else if (err.error?.message) {
  this.serverErrorMessage = err.error.message;
} else {
  this.serverErrorMessage = 'Registration failed. Please try again';
}
}
});
}

goToLogin() {
  this.router.navigate([RoutePaths.login]);
}
}
