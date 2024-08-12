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

  // Método de inicio de sesión
  login(user: UserLogin): Observable<any> {
    // Antes de iniciar sesión, limpia cualquier sesión previa
    this.clearSession();

    const url = this.url_backend + 'users/login/';
    return this.http.post(url, user, httpOptions);
  }

  // Guardar el token en localStorage
  saveToken(token: string): void {
    this.clearSession(); // Limpia cualquier sesión previa antes de guardar el nuevo token
    localStorage.setItem(TOKEN_KEY, token);
  }

  // Guardar la información del usuario en localStorage
  saveUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  // Obtener la información del usuario desde localStorage
  getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(atob(user.split('.')[1])) : null;
  }

  // Obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Método para recibir cambios en el estado de autenticación
  recieve(data: boolean) {
    this.dataSubject.next(data);
  }

  // Método para cerrar sesión y limpiar todos los datos
  logout() {
    this.clearSession();
  }

  // Limpiar token y datos de usuario en localStorage
  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export interface UserLogin {
  email: string;
  password: string;
}
