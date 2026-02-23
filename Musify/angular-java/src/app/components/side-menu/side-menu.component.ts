import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { RoutePaths } from '../../app.routes';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-side-menu',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  RoutePaths = RoutePaths;
  currentRoute: string = '';
  userRole: string | null = null;

  constructor(private router: Router, private authService: AuthService) { }
  ngOnInit() {
    this.userRole = this.authService.getRole();
  }
  navigateTo(path: string) {
    this.router.navigate([path])
  }
}
