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
      <h3 class="mb-4">Acessos ao Estacionamento</h3>
      @if (filtroKeys.length > 0) {
      <div class="mb-3">
        <strong>Filtros aplicados:</strong>
        <ul>
          <li *ngFor="let key of filtroKeys" class="mb-1" style="font-size: 0.95em;">
            <strong>{{ filtroLabels[key] || key }}:</strong>
            <ng-container *ngIf="isDateFiltro(key); else textoFiltro">
              {{ filtros[key] | date:'short' }}
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
    lotacao: 'Lotação'
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
    });
    this.acessoService.getAll().subscribe((data) => {
      this.acessos = data;
      setTimeout(() => window.print(), 500);
    });
  }

  isDateFiltro(key: string): boolean {
    return [
      'entrada_inicio',
      'entrada_fim',
      'saida_inicio',
      'saida_fim'
    ].includes(key) && this.filtros[key] && !isNaN(Date.parse(this.filtros[key]));
  }
}
