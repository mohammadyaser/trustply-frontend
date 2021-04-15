import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject,timer } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: any;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  verifyCode: any;
  subscription;

  constructor(private http: HttpClient, private router: Router , private userService: UserService) {}
  getToken() {
    return this.token;
  }
  getIsAuth() {
    return this.isAuthenticated;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  createUser(name: String, email: string, password: string) {
    const authData = { name: name, email: email, password: password };
    this.http.post('http://localhost:92/api/users/signup', authData).subscribe(
      (response: any) => {
        localStorage.setItem('email', email);
        this.verifyCode = response?.result[0].verifyCode;
        this.router.navigate(['signup/confirm']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  confirmUser(verifyCode: string) {
    let email = localStorage.getItem('email');
    const authData = { verifyCode: verifyCode, email: email };
    this.http
      .post('http://localhost:92/api/users/signup/confirm', authData)
      .subscribe(
        (response: any) => {
          const token = response?.result[0].token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.result[0].expiresIn;
            const userId = response.result[0].userId;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);

            const now = new Date();
            const expirationDate = new Date(now.getTime() + +expiresInDuration);
            this.saveAuthData(token, expirationDate, userId);
            this.router.navigate(['/user']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }
  login(email: string, password: string) {
    const loginData = { email: email, password: password };
    this.http
      .post<{ status: string; result: any }>(
        'http://localhost:92/api/users/login',
        loginData
      )
      .subscribe(
        (response) => {
          const token = response?.result[0].token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.result[0].expiresIn;
            const userId = response.result[0].userId;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);

            const now = new Date();
            const expirationDate = new Date(now.getTime() + +expiresInDuration);
            this.saveAuthData(token, expirationDate, userId);
            this.subscription = timer(100, 100).subscribe(t => {
              this.userService.getPoking()
            });
            this.router.navigate(['/user']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );

  }
  autoAuthUser() {
    const authInformation: any = this.getAuthData();
    const now = new Date();
    const expiresIn: any =
      authInformation?.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation?.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn);
      this.authStatusListener.next(true);
    }
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.http.get('http://localhost:92/api/users/logout').subscribe(() => {
      this.router.navigate(['/login']);
    });
    this.subscription.unsubscribe();
  }

  private setAuthTimer(duration) {
    console.log('setting timer', duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, +duration);
  }

  private saveAuthData(token: string, expirationData: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expiration', expirationData.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      userId,
      expirationDate: new Date(expirationDate),
    };
  }
}
