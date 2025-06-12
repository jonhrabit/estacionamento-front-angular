import { Pessoa } from './../pessoa';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PessoaService {
  private apiUrl = 'pessoas/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`);
  }

  create(pessoa: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pessoa);
  }

  update(id: number, pessoa: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}`, pessoa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
