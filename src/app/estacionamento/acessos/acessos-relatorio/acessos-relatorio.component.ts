import { Component, OnInit } from '@angular/core';
import { AcessoService } from '../../services/acesso.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acessos-relatorio',
  imports: [CommonModule, FormsModule],
  templateUrl: './acessos-relatorio.component.html',
})
export class AcessosRelatorioComponent implements OnInit {
  acessos: any[] = [];
  filtroAcesso = {
    id: '',
    entrada_inicio: '',
    entrada_fim: '',
    saida_inicio: '',
    saida_fim: '',
    ativo: '',
    observacao: '',
    placa: '',
    proprietario: '',
    tipoVinculo: '',
    cargo: '',
    lotacao: ''
  };

  constructor(
    private acessoService: AcessoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Define datas padrão para o mês atual no formato datetime-local
    const primeiroDia = this.getPrimeiroDiaMes();
    const ultimoDia = this.getUltimoDiaMes();
    this.filtroAcesso.entrada_inicio = this.toDatetimeLocalString(primeiroDia);
    this.filtroAcesso.entrada_fim = this.toDatetimeLocalString(ultimoDia, true);
    this.acessoService.getAll().subscribe((data) => {
      this.acessos = data;
    });
    this.consultarAcessos();
  }

  consultarAcessos() {
    this.acessoService.getAll().subscribe((data) => {
      this.acessos = data.filter(
        (a: any) =>
          this.filtroSimples(a) &&
          this.dateBetweenEntrada(a) &&
          this.dateBetweenSaida(a)
      );
    });
  }

  filtroSimples(a: any): boolean {
    const matchId =
      this.filtroAcesso.id === '' || String(a.id).includes(this.filtroAcesso.id);
    const matchAtivo =
      this.filtroAcesso.ativo === '' ||
      String(a.ativo)
        .toLowerCase()
        .includes(this.filtroAcesso.ativo.toLowerCase());
    const matchObs =
      this.filtroAcesso.observacao === '' ||
      (a.observacao &&
        a.observacao
          .toLowerCase()
          .includes(this.filtroAcesso.observacao.toLowerCase()));
    const matchPlaca =
      this.filtroAcesso.placa === '' ||
      (a.veiculo?.placa &&
        a.veiculo.placa
          .toLowerCase()
          .includes(this.filtroAcesso.placa.toLowerCase()));
    const matchProprietario =
      this.filtroAcesso.proprietario === '' ||
      (a.veiculo?.pessoa?.nome &&
        a.veiculo.pessoa.nome
          .toLowerCase()
          .includes(this.filtroAcesso.proprietario.toLowerCase()));
    const matchTipoVinculo =
      this.filtroAcesso.tipoVinculo === '' ||
      (a.veiculo?.pessoa?.tipoVinculo &&
        a.veiculo.pessoa.tipoVinculo
          .toLowerCase()
          .includes(this.filtroAcesso.tipoVinculo.toLowerCase()));
    const matchCargo =
      this.filtroAcesso.cargo === '' ||
      (a.veiculo?.pessoa?.cargo &&
        a.veiculo.pessoa.cargo
          .toLowerCase()
          .includes(this.filtroAcesso.cargo.toLowerCase()));
    const matchLotacao =
      this.filtroAcesso.lotacao === '' ||
      (a.veiculo?.pessoa?.lotacao &&
        a.veiculo.pessoa.lotacao
          .toLowerCase()
          .includes(this.filtroAcesso.lotacao.toLowerCase()));
    return matchId && matchAtivo && matchObs && matchPlaca && matchProprietario && matchTipoVinculo && matchCargo && matchLotacao;
  }

  dateBetweenEntrada(a: any): boolean {
    let match = true;
    if (this.filtroAcesso.entrada_inicio) {
      const entradaA = a.entrada ? new Date(a.entrada).getTime() : null;
      const inicio = new Date(this.filtroAcesso.entrada_inicio).getTime();
      match = entradaA !== null && entradaA >= inicio;
    }
    if (match && this.filtroAcesso.entrada_fim) {
      const entradaA = a.entrada ? new Date(a.entrada).getTime() : null;
      const fim = new Date(this.filtroAcesso.entrada_fim).getTime();
      match = entradaA !== null && entradaA <= fim;
    }
    return match;
  }

  dateBetweenSaida(a: any): boolean {
    let match = true;
    if (this.filtroAcesso.saida_inicio) {
      const saidaA = a.saida ? new Date(a.saida).getTime() : null;
      const inicio = new Date(this.filtroAcesso.saida_inicio).getTime();
      match = saidaA !== null && saidaA >= inicio;
    }
    if (match && this.filtroAcesso.saida_fim) {
      const saidaA = a.saida ? new Date(a.saida).getTime() : null;
      const fim = new Date(this.filtroAcesso.saida_fim).getTime();
      match = saidaA !== null && saidaA <= fim;
    }
    return match;
  }

  /**
   * Retorna o primeiro dia do mês da data informada (ou do mês atual se não informado)
   */
  getPrimeiroDiaMes(date?: Date): Date {
    const d = date ? new Date(date) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  /**
   * Retorna o último dia do mês da data informada (ou do mês atual se não informado)
   */
  getUltimoDiaMes(date?: Date): Date {
    const d = date ? new Date(date) : new Date();
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
  }

  /**
   * Converte uma data para o formato yyyy-MM-ddTHH:mm para input type="datetime-local"
   * Se endOfDay for true, define hora para 23:59
   */
  toDatetimeLocalString(date: Date, endOfDay: boolean = false): string {
    const d = new Date(date);
    if (endOfDay) {
      d.setHours(23, 59, 0, 0);
    } else {
      d.setHours(0, 0, 0, 0);
    }
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  limparCampos() {
    this.filtroAcesso = {
      id: '',
      entrada_inicio: '',
      entrada_fim: '',
      saida_inicio: '',
      saida_fim: '',
      ativo: '',
      observacao: '',
      placa: '',
      proprietario: '',
      tipoVinculo: '',
      cargo: '',
      lotacao: ''
    };
    this.ngOnInit();
  }

  imprimirRelatorio() {
    // Monta os query params com os filtros atuais
    const params = Object.entries(this.filtroAcesso)
      .filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
      .join('&');
    window.open(`/acessos-relatorio-print${params ? '?' + params : ''}`, '_blank');
  }

}
