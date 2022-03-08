import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, of } from 'rxjs';

import { map, distinctUntilChanged, catchError } from 'rxjs/operators';
import { ApiService, JwtService } from '.';

@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUserSubject = new BehaviorSubject<any>({} as any);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private http: HttpClient
  ) {}

  public get authenticated() {
    return this.isAuthenticatedSubject.value;
  }

  contextPopulate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.get()) {
      // console.log('this.jwtService.getToken()', this.jwtService.get());
      return this.apiService.get('/users/context').pipe(
        map((res) => {
          this.setAuth(res.data);
          return res.data;
        }),
        catchError((e) => {
          this.purgeAuth();
          return of(null);
        })
      );
    } else {
      return of(null);
    }
  }

  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.get()) {
      this.apiService.get('/users/context').subscribe(
        (data) => this.setAuth(data.data.user),
        (err) => {
          this.purgeAuth();
          console.error('Error populating user', err);
        }
      );
    } else {
      console.log('JWT Error');
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: any) {
    // Save JWT sent from server in localstorage
    this.jwtService.save(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroy();
    // Set current user to an empty object
    this.currentUserSubject.next({} as any);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(type: string, credentials: Object): Observable<any> {
    const route = type === 'login' ? '/login' : '/signUp';
    let data;
    type === 'login'
      ? (data = { user: credentials })
      : (data = { user: credentials });
    return this.apiService.post('/users' + route, data).pipe(
      map((data) => {
        if (type === 'login') this.setAuth(data.data);
        return data;
      })
    );
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  OTPVerify(email: string, otp: number, flag: number): Observable<any> {
    return this.apiService.post(`/users/otp/verify/${email}/${flag}`, { otp });
  }

  ResendOTP(email: string): Observable<any> {
    return this.apiService.post(`/users/otp/resend/${email}`, {});
  }

  ResetPassword(
    email: string,
    password: string,
    resetPasswordToken: string
  ): Observable<any> {
    return this.apiService.post(`/users/reset/password/${email}`, {
      password,
      resetPasswordToken,
    });
  }

  changeStatus(email: string, status: number): Observable<any> {
    return this.apiService.put(`/users/verify/${email}/${status}`);
  }
}
