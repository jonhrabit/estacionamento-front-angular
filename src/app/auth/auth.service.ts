import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  token: string;
}
interface AuthSession {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
  usrd:string;
  scope:string
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly STORAGE_KEY = 'estacionamento';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: {
    username: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('login', credentials)
      .pipe(
        tap((response) => {
          const decoded = jwtDecode(response.token);
          const dados = {...decoded, ...response}
          sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(dados));


    this.router.navigate(['/home']);
        })
      );
  }

  logout() {
    sessionStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  getUsuarioLogado(): AuthSession | null {
    const dados = sessionStorage.getItem(this.STORAGE_KEY);
    return dados ? JSON.parse(dados) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUsuarioLogado();
  }
}
