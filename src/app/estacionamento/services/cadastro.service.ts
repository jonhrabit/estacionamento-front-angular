import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cadastro } from '../cadastro';

@Injectable({ providedIn: 'root' })
export class CadastroService {
  private apiUrl = 'acessos/';

  constructor(private http: HttpClient) {}


  create(cadastro: Cadastro): Observable<Cadastro> {
    return this.http.post<Cadastro>(this.apiUrl+"cadastro", cadastro);
  }

}
