import { Veiculo } from './../veiculo';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Acesso } from '../acesso';

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
  setSaida(id: number): Observable<any> {
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

  update(id: number, acesso: Acesso): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}`, acesso);
  }
  exportar(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}exportar`,);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }

  /**
   * Busca todos os acessos e filtra pela data de entrada entre startDate e endDate (inclusive).
   * @param startDate Data inicial (Date ou string ISO)
   * @param endDate Data final (Date ou string ISO)
   */
  getByEntradaEntre(startDate: Date | string, endDate: Date | string): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      this.getAll().subscribe({
        next: (acessos) => {
          const inicio = new Date(startDate).getTime();
          const fim = new Date(endDate).getTime();
          const filtrados = acessos.filter(a => {
            const entrada = a.entrada ? new Date(a.entrada).getTime() : null;
            return entrada !== null && entrada >= inicio && entrada <= fim;
          });
          observer.next(filtrados);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  /**
   * Busca todos os acessos e filtra pela data de saída entre startDate e endDate (inclusive).
   * @param startDate Data inicial (Date ou string ISO)
   * @param endDate Data final (Date ou string ISO)
   */
  getBySaidaEntre(startDate: Date | string, endDate: Date | string): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      this.getAll().subscribe({
        next: (acessos) => {
          const inicio = new Date(startDate).getTime();
          const fim = new Date(endDate).getTime();
          const filtrados = acessos.filter(a => {
            const saida = a.saida ? new Date(a.saida).getTime() : null;
            return saida !== null && saida >= inicio && saida <= fim;
          });
          observer.next(filtrados);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }
}
