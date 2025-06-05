import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'usuarios/';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}${id}`);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}${id}`, usuario);
  }

  passwordResetUsuario(id: number): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}resetsenha/${id}`,null);
  }

  passwordAlterarUsuario(id: number, novaSenha:String, senha:String): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}alterarsenha/${id}`, {
      senhaAtual: senha,
      novaSenha: novaSenha});
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
