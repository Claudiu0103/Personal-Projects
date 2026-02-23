import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';
import { UserSimple } from '../../core/models/user-simple';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-profile-modal',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './profile-modal.component.html',
  styleUrl: './profile-modal.component.scss',
})
export class ProfileModalComponent {
  user:User|null=null;
  showPasswordFields: boolean = false;
  editProfileMode: boolean = false;

  editProfile: UserSimple = {
    id:0,
    firstName: '',
    lastName: '',
    country: ''
  };

  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toastService: ToastService,
    public dialogRef: MatDialogRef<ProfileModalComponent>,
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe({
      next: (userResponse:User) => {
        this.user=userResponse;
        this.editProfile = {
          id: this.user.id,
          firstName: this.user.firstName || '',
          lastName: this.user.lastName || '',
          country: this.user.country || ''
        };
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }

  clearPasswords() {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }

  togglePasswordChange() {
    this.showPasswordFields = !this.showPasswordFields;
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.showPasswordFields)
      this.clearPasswords();
  }

  toggleEditProfile() {
    if(!this.user)
      return;
    this.editProfileMode = !this.editProfileMode;
    this.showPasswordFields = false;
    this.errorMessage = '';
    this.successMessage = '';
    if (this.editProfileMode) {
      this.editProfile = {
        id: this.user.id,
        firstName: this.user.firstName || '',
        lastName: this.user.lastName || '',
        country: this.user.country || ''
      };
    }
  }

  submitPasswordChange() {
    if (this.currentPassword === '' || this.newPassword === '' || this.confirmNewPassword === '') {
      this.errorMessage = 'Password fields cannot be empty';
      this.successMessage = '';
      this.clearPasswords();
      return;
    }
    if (this.currentPassword === this.newPassword) {
      this.errorMessage = 'Passwords are the same!';
      this.successMessage = '';
      this.clearPasswords();
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.errorMessage = 'Error at confirming password';
      this.successMessage = '';
      this.clearPasswords();
      return;
    }
    this.userService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.errorMessage = '';
        this.successMessage = 'Password changed successfully';
        this.clearPasswords();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.successMessage = '';
        this.clearPasswords();
      }
    });
  }

  submitProfileUpdate() {
    if (this.editProfile.firstName === '' || this.editProfile.lastName === '' || this.editProfile.country === '') {
      this.errorMessage = 'Profile fields cannot be empty';
      this.successMessage = '';
      return;
    }
    
    this.userService.updateUser(this.editProfile).subscribe({
      next: (userResponse) => {
        this.user=userResponse;
        this.toastService.showSuccess('Profile updated succesfully');
        this.editProfileMode = false;
      },
      error: (err) => {
        this.toastService.showError(err.error.message);
        this.successMessage = '';
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}