import { Component, OnInit } from '@angular/core';
import { BotaoMenuComponent } from './botao-menu/botao-menu.component';
import { AcessoService } from '../estacionamento/services/acesso.service';
import { CommonModule } from '@angular/common';
import { Acesso } from '../estacionamento/acesso';
import { InputplacaComponent } from './inputplaca.component';

@Component({
  selector: 'app-home',
  imports: [BotaoMenuComponent, CommonModule, InputplacaComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  acessos: Acesso[] = [];
  constructor(private acessoService: AcessoService) {}

  ngOnInit(): void {
    this.acessoService.getSaida().subscribe({
      next: (data) => {
        this.acessos = data;
        this.ordenarAcessosPorDataDesc();
      },
      error: (erro) => {
        console.error(erro);
      },
      complete: () => {},
    });
  }

  addAcesso(acesso: Acesso): void {
    this.acessos.push(acesso);
    this.ordenarAcessosPorDataDesc();
  }

  ordenarAcessosPorDataDesc() {
    this.acessos.sort((a, b) => {
      const dataA = new Date(a.entrada).getTime();
      const dataB = new Date(b.entrada).getTime();
      return dataB - dataA;
    });
  }
}
