import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroments';
import { Endpoints } from '../endpoints';
import { User } from "../models/user"
import { UserSimple } from '../models/user-simple';
import { UserDetails } from '../models/userDetails';
import { Page } from '../models/page';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) { }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}${Endpoints.changePassword}`, { oldPassword, newPassword }, { withCredentials: true });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}${Endpoints.me}`, {
      withCredentials: true
    });
  }

  getUsersPaginated(page: number, size: number): Observable<Page<UserDetails>> {
    return this.http.get<Page<UserDetails>>(`${this.apiUrl}${Endpoints.userDetails}?page=${page}&size=${size}`, {
      withCredentials: true
    });
  }

  deleteUser(userId: number, isDeleted: boolean): Observable<UserDetails> {
    const body = { isDeleted };
    return this.http.patch<UserDetails>(`${this.apiUrl}${Endpoints.userOperations}/${userId}`, isDeleted, { withCredentials: true })
  }

  changeRole(userId: number): Observable<UserDetails> {
    return this.http.put<UserDetails>(`${this.apiUrl}${Endpoints.userOperations}/${userId}`, { withCredentials: true })
  }

  updateUser(user: UserSimple): Observable<any> {
    return this.http.put(`${this.apiUrl}${Endpoints.updateUser}`, user, { withCredentials: true });
  }
}
