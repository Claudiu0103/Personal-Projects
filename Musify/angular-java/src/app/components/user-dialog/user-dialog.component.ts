import { Component, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserDetails } from '../../core/models/userDetails';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../core/services/user.service';
import { ToastService } from '../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-dialog',
  imports: [
    MatDialogModule,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {
  readonly REGULAR = 'REGULAR';

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;
  private confirmationRef!: MatDialogRef<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public user: UserDetails,
    private toastService: ToastService,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserService,
    private dialog: MatDialog
    
  ) { }

  banUser(userId: number) {
  this.confirmationRef = this.dialog.open(this.confirmDialog);

  this.confirmationRef.afterClosed().subscribe(result => {
    if (result) {
      this.userService.deleteUser(userId, true).subscribe({
        next: () => {
          this.toastService.showSuccess("User banned");
          this.dialogRef.close(true);
        },
        error: () => this.toastService.showError('Failed to delete user')
      });
    }
  });
}

  cancelBan() {
  this.confirmationRef.close(false);
}

confirmBan() {
  this.confirmationRef.close(true);
}

  changeRole(userId: number) {
    this.userService.changeRole(userId).subscribe({
      next: () => {
        this.toastService.showSuccess("Role changed");
        this.dialogRef.close(true);
      },
      error: () => this.toastService.showError('Failed to change the role')
    });
  }
}
