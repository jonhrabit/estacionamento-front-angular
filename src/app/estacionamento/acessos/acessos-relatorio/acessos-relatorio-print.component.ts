import { Component, OnInit } from '@angular/core';
import { AcessoService } from '../../services/acesso.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import './acessos-relatorio-print.component.css';

@Component({
  selector: 'app-acessos-relatorio-print',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="fs-4 text">Acessos ao Estacionamento</div>
      @if (filtroKeys.length > 0) {
      <div class="mb-3">
        <ul>
          <li
            *ngFor="let key of filtroKeys"
            class="mb-1"
            style="font-size: 0.95em;"
          >
            <strong>{{ filtroLabels[key] || key }}: </strong>
            <ng-container *ngIf="isDateFiltro(key); else textoFiltro">
              {{ filtros[key] | date : 'short' }}
            </ng-container>
            <ng-template #textoFiltro>{{ filtros[key] }}</ng-template>
          </li>
        </ul>
      </div>

      }

      <div class="mb-2 text-end">
        <strong>Total de registros: {{ acessos.length }}</strong>
      </div>
      <table class="table table-bordered table-sm" style="font-size:10px;">
        <thead>
          <tr>
            <th>ID</th>
            <th>Proprietário</th>
            <th>Veículo</th>
            <th>Data Entrada</th>
            <th>Data Saída</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let acesso of acessos">
            <td>{{ acesso.id }}</td>
            <td>{{ acesso.veiculo?.pessoa?.nome }}</td>
            <td>{{ acesso.veiculo?.placa }}</td>
            <td>{{ acesso.entrada | date : 'short' }}</td>
            <td>{{ acesso.saida | date : 'short' }}</td>
            <td>{{ acesso.observacao }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['./acessos-relatorio-print.component.css'],
})
export class AcessosRelatorioPrintComponent implements OnInit {
  acessos: any[] = [];
  filtros: any = {};
  filtroKeys: string[] = [];
  filtroLabels: { [key: string]: string } = {
    id: 'ID',
    entrada_inicio: 'Entrada (de)',
    entrada_fim: 'Entrada (até)',
    saida_inicio: 'Saída (de)',
    saida_fim: 'Saída (até)',
    ativo: 'Ativo',
    observacao: 'Observação',
    placa: 'Placa',
    proprietario: 'Proprietário',
    tipoVinculo: 'Tipo de Vínculo',
    cargo: 'Cargo',
    lotacao: 'Lotação',
  };

  constructor(
    private acessoService: AcessoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filtros = { ...params };
      this.filtroKeys = Object.keys(this.filtros).filter(
        (k) =>
          this.filtros[k] !== '' &&
          this.filtros[k] !== null &&
          this.filtros[k] !== undefined
      );
      this.acessoService.getAll().subscribe((data) => {
        this.acessos = data.filter((a: any) => this.aplicaFiltros(a));
        setTimeout(() => window.print(), 500);
      });
    });
  }

  aplicaFiltros(a: any): boolean {
    const matchId = !this.filtros.id || String(a.id).includes(this.filtros.id);
    const matchObs =
      !this.filtros.observacao ||
      (a.observacao &&
        a.observacao
          .toLowerCase()
          .includes(this.filtros.observacao.toLowerCase()));
    const matchPlaca =
      !this.filtros.placa ||
      (a.veiculo?.placa &&
        a.veiculo.placa
          .toLowerCase()
          .includes(this.filtros.placa.toLowerCase()));
    const matchProprietario =
      !this.filtros.proprietario ||
      (a.veiculo?.pessoa?.nome &&
        a.veiculo.pessoa.nome
          .toLowerCase()
          .includes(this.filtros.proprietario.toLowerCase()));
    const matchTipoVinculo =
      !this.filtros.tipoVinculo ||
      (a.veiculo?.pessoa?.tipoVinculo &&
        a.veiculo.pessoa.tipoVinculo
          .toLowerCase()
          .includes(this.filtros.tipoVinculo.toLowerCase()));
    const matchCargo =
      !this.filtros.cargo ||
      (a.veiculo?.pessoa?.cargo &&
        a.veiculo.pessoa.cargo
          .toLowerCase()
          .includes(this.filtros.cargo.toLowerCase()));
    const matchLotacao =
      !this.filtros.lotacao ||
      (a.veiculo?.pessoa?.lotacao &&
        a.veiculo.pessoa.lotacao
          .toLowerCase()
          .includes(this.filtros.lotacao.toLowerCase()));
    let matchEntrada = true;
    if (this.filtros.entrada_inicio) {
      const entradaA = a.entrada ? new Date(a.entrada).getTime() : null;
      const inicio = new Date(this.filtros.entrada_inicio).getTime();
      matchEntrada = entradaA !== null && entradaA >= inicio;
    }
    if (matchEntrada && this.filtros.entrada_fim) {
      const entradaA = a.entrada ? new Date(a.entrada).getTime() : null;
      const fim = new Date(this.filtros.entrada_fim).getTime();
      matchEntrada = entradaA !== null && entradaA <= fim;
    }
    let matchSaida = true;
    if (this.filtros.saida_inicio) {
      const saidaA = a.saida ? new Date(a.saida).getTime() : null;
      const inicio = new Date(this.filtros.saida_inicio).getTime();
      matchSaida = saidaA !== null && saidaA >= inicio;
    }
    if (matchSaida && this.filtros.saida_fim) {
      const saidaA = a.saida ? new Date(a.saida).getTime() : null;
      const fim = new Date(this.filtros.saida_fim).getTime();
      matchSaida = saidaA !== null && saidaA <= fim;
    }
    return (
      matchId &&
      matchObs &&
      matchPlaca &&
      matchProprietario &&
      matchTipoVinculo &&
      matchCargo &&
      matchLotacao &&
      matchEntrada &&
      matchSaida
    );
  }

  isDateFiltro(key: string): boolean {
    return (
      ['entrada_inicio', 'entrada_fim', 'saida_inicio', 'saida_fim'].includes(
        key
      ) &&
      this.filtros[key] &&
      !isNaN(Date.parse(this.filtros[key]))
    );
  }
}
