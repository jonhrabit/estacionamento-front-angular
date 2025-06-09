import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AcessoService {
  private apiUrl = 'acessos/';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}`);
  }
  getSaida(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}saida`);
  }
  setSaida(id:number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}saida/${id}`, '');
  }
  createByPlaca(placa: String, obs: String): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}entrada/${placa}`, { obs });
  }
  createById(id: number, obs: String): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}entradaporid/${id}`, { obs });
  }

  create(acesso: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, acesso);
  }

  update(id: number, acesso: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}`, acesso);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
