import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ClickOutsideModule } from 'ng-click-outside';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { RoutePaths } from '../../app.routes';
import { ProfileModalComponent } from '../profile-modal/profile-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatMenuModule,
    ClickOutsideModule,
  ],
  templateUrl: './profile-dropdown.component.html',
  styleUrl: './profile-dropdown.component.scss'
})
export class ProfileDropdownComponent {

  constructor(private router:Router, private authService:AuthService, private dialog: MatDialog){}
  errorMessage='';
  isOpen=false;
  closeDropdown(){
    this.isOpen=false;
  }
  toggleDropdown(){
    this.isOpen=!this.isOpen;
  }
  openProfileModal() {
    this.dialog.open(ProfileModalComponent, {
       panelClass: 'profile-dialog'
    });
    this.closeDropdown();
  }
  logOut(){
    this.closeDropdown();
    this.authService.logOut();
    this.router.navigate([RoutePaths.login]);
  }
}
