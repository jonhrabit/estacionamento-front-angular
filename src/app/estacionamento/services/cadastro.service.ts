import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cadastro } from '../cadastro';

@Injectable({ providedIn: 'root' })
export class CadastroService {
  private apiUrl = 'cadastros/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cadastro[]> {
    return this.http.get<Cadastro[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cadastro> {
    return this.http.get<Cadastro>(`${this.apiUrl}${id}`);
  }

  create(cadastro: Cadastro): Observable<Cadastro> {
    return this.http.post<Cadastro>(this.apiUrl, cadastro);
  }

  update(id: number, cadastro: Cadastro): Observable<Cadastro> {
    return this.http.put<Cadastro>(`${this.apiUrl}${id}`, cadastro);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
