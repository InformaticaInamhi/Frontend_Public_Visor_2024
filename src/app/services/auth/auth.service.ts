import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'auth-user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url_backend = environment.urlBack;
  public dataSubject = new Subject<boolean>();
  public dataState = this.dataSubject.asObservable();
  constructor(private http: HttpClient) {}

  login(user: UserLogin): Observable<any> {
    return this.http.post(this.url_backend + 'users/login/', user, httpOptions);
  }

  saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  saveUser(user: any): void {
    localStorage.removeItem(USER_KEY);
    localStorage.setItem('auth-user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(atob(user.split('.')[1])) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  recieve(data: boolean) {
    this.dataSubject.next(data);
  }
  logout() {
    localStorage.clear();
  }

}

export interface UserLogin {
  email: string;
  password: string;
}
