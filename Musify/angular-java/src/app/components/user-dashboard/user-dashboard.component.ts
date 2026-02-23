import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetails } from '../../core/models/userDetails';
import { UserService } from '../../core/services/user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
    MatSortModule,
    FormsModule
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss'],
})
export class UserDashboardComponent implements OnInit, AfterViewInit {
  users: UserDetails[] = [];
  dataSource = new MatTableDataSource<UserDetails>();
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'country', 'role', 'isDeleted'];

  pageSize = 10;
  currentPage = 0;
  totalPages = 0;
  totalItems = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(page: number = 0): void {
    this.userService.getUsersPaginated(page, this.pageSize).subscribe(response => {
      this.users = response.content;
      this.totalPages = response.totalPages;
      this.totalItems = response.totalElements;
      this.currentPage = response.number;

      this.dataSource.data = this.users;
    });
  }

  onPageChangeCustom(newPage: number): void {
    if (newPage < 0 || newPage * this.pageSize >= this.totalItems) return;
    this.currentPage = newPage;
    this.loadUsers(this.currentPage);
  }

  getEndIndex(): number {
    const end = (this.currentPage + 1) * this.pageSize;
    return end > this.totalItems ? this.totalItems : end;
  }

  openUserDialog(user: UserDetails): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: user,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(this.currentPage);
      }
    });
  }
}
