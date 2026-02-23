import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login-response';
import { environment } from '../../../enviroments/enviroments';
import { BehaviorSubject } from 'rxjs';
import { Endpoints } from '../endpoints';

import { Pipe } from '@angular/core';
import { tap, map, catchError, of } from 'rxjs';
import { RegisterResponse } from '../models/register-response';
import { E } from '@angular/cdk/keycodes';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../models/jwt-payload';
import { CookieUtils } from '../utils/cookie-utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`


  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }


  register(firstName: string, lastName: string, email: string, country: string, password: string) {
    return this.http.post<RegisterResponse>(`${this.apiUrl}${Endpoints.register}`, { firstName, lastName, email, country, password }, { withCredentials: true });
  }

  checkSession(): Observable<boolean> {
    const token = CookieUtils.getCookie("jwtToken");

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        this.isLoggedInSubject.next(true);
        this.userSubject.next({
          email: decoded.sub,
          role: decoded.role,
          id: decoded.id
        });
        return of(true);
      } catch (e) {
        console.error("Token invalid:", e);
        this.isLoggedInSubject.next(false);
        this.userSubject.next(null);
        return of(false);
      }
    } else {
      this.isLoggedInSubject.next(false);
      this.userSubject.next(null);
      return of(false);
    }
  }


  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}${Endpoints.login}`,
      { email, password },
      { withCredentials: true }
    ).pipe(
      tap(() => {
        const token = CookieUtils.getCookie("jwtToken");
        if (token) {
          try {
            const decoded = jwtDecode<JwtPayload>(token);
            this.isLoggedInSubject.next(true);
            this.userSubject.next({
              email: decoded.sub,
              role: decoded.role,
              id: decoded.id
            });
          } catch (e) {
            console.error("Token invalid după login");
            this.logOut();
          }
        }
      })
    );
  }


  logOut() {
    CookieUtils.deleteCookie("jwtToken");
  }

  getRole(): string | null {
    const token = CookieUtils.getCookie("jwtToken");
    if (!token) {
      return null;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.role;
    } catch {
      return null;
    }
  }

  getUserId(): number | null {
    const user = this.userSubject.value;
    return user ? user.id : null;
  }


}
