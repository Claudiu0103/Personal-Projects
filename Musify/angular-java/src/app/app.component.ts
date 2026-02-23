import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { AuthService } from './core/services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { ToastNotificationComponent } from './components/toast/toast-notification/toast-notification.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavMenuComponent, SideMenuComponent, ToastNotificationComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  loggedIn = false;
  constructor(private authService: AuthService) {
    this.authService.isLoggedIn$.subscribe(value => {
      this.loggedIn = value;
    });
  }
}
