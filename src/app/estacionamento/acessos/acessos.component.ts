import { Component, OnInit } from '@angular/core';
import { AcessoService } from '../services/acesso.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcessoEditarModalComponent } from './acesso-editar-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../shared/toast-global/toast.service';

@Component({
  selector: 'app-acessos',
  templateUrl: './acessos.component.html',
  imports: [CommonModule, FormsModule],
})
export class AcessosComponent implements OnInit {
  acessos: any[] = [];
  acessosFiltrados: any[] = [];
  filtro: string = '';
  paginaAtual = 1;
  itensPorPagina = 10;
  colunaOrdenacao: string = '';
  direcaoOrdenacao: 'asc' | 'desc' = 'asc';

  constructor(
    private acessoService: AcessoService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.carregarAcessos();
  }

  carregarAcessos() {
    this.acessoService.getAll().subscribe((data) => {
      this.acessos = data;
      console.log(this.acessos);

      this.aplicarFiltro();
    });
  }

  aplicarFiltro() {
    this.acessosFiltrados = this.acessos.filter(
      (a) =>
        a.veiculo?.pessoa?.nome
          ?.toLowerCase()
          .includes(this.filtro.toLowerCase()) ||
        a.veiculo?.placa?.toLowerCase().includes(this.filtro.toLowerCase()) ||
        a.observacao?.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.paginaAtual = 1;
    if (this.colunaOrdenacao) {
      this.ordenarAcessos();
    }
  }

  ordenarPor(coluna: string) {
    if (this.colunaOrdenacao === coluna) {
      this.direcaoOrdenacao = this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenacao = coluna;
      this.direcaoOrdenacao = 'asc';
    }
    this.ordenarAcessos();
  }

  ordenarAcessos() {
    this.acessosFiltrados.sort((a, b) => {
      let valorA, valorB;
      switch (this.colunaOrdenacao) {
        case 'id':
          valorA = a.id;
          valorB = b.id;
          break;
        case 'proprietario':
          valorA = a.veiculo?.pessoa?.nome || '';
          valorB = b.veiculo?.pessoa?.nome || '';
          break;
        case 'placa':
          valorA = a.veiculo?.placa || '';
          valorB = b.veiculo?.placa || '';
          break;
        case 'entrada':
          valorA = a.entrada;
          valorB = b.entrada;
          break;
        case 'saida':
          valorA = a.saida;
          valorB = b.saida;
          break;
        case 'observacao':
          valorA = a.observacao || '';
          valorB = b.observacao || '';
          break;
        default:
          valorA = '';
          valorB = '';
      }
      if (valorA == null) valorA = '';
      if (valorB == null) valorB = '';
      if (this.direcaoOrdenacao === 'asc') {
        return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
      } else {
        return valorA < valorB ? 1 : valorA > valorB ? -1 : 0;
      }
    });
  }

  get acessosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.acessosFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.acessosFiltrados.length / this.itensPorPagina);
  }

  get paginasPaginacao(): number[] {
    const paginas: number[] = [];
    const total = this.totalPaginas;
    let inicio = Math.max(1, this.paginaAtual - 2);
    let fim = Math.min(total, this.paginaAtual + 2);
    if (fim - inicio < 4) {
      if (inicio === 1) fim = Math.min(total, inicio + 4);
      if (fim === total) inicio = Math.max(1, fim - 4);
    }
    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }
    return paginas;
  }

  abrirModalEdicao(acesso: any) {
    const modalRef = this.modalService.open(AcessoEditarModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.acesso = { ...acesso };
    modalRef.result.then(
      (result) => {
        if (result) {
          this.acessoService
            .update(result.id, result)
            .subscribe(() => this.carregarAcessos());
        }
      },
      () => {}
    );
  }

  excluirAcesso(acesso: any) {
    if (
      window.confirm(
        `Deseja realmente excluir o acesso de ${acesso.pessoa?.nome || ''}?`
      )
    ) {
      this.acessoService
        .delete(acesso.id)
        .subscribe(() => this.carregarAcessos());
    }
  }

  novoAcesso() {
    const modalRef = this.modalService.open(AcessoEditarModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.acesso = {
      veiculo: null,
      entrada: '',
      saida: '',
      observacao: '',
    };

    modalRef.result.then(
      (result) => {
        if (result) {
          delete result.veiculo.pessoa;
          delete result.id;
          this.acessoService
            .create(result)
            .subscribe(() => this.carregarAcessos());
        }
      },
      () => {}
    );
  }
  exportarDados() {
    this.acessoService.exportar().subscribe({
      next: (data) => {
        if (!data || data.length === 0) {
          this.toastService.show(
            'Nenhum dado disponível para exportação.',
            'warning'
          );
          return;
        }
        // Transforma o objeto data em CSV
        let csv = '';
        if (Array.isArray(data) && data.length > 0) {
          // Cabeçalho
          const colunas = [
            'ID',
            'Proprietário',
            'Placa',
            'Entrada',
            'Saída',
            'Observação',
          ];
          csv += colunas.join(';') + '\n';
          // Linhas
          data.forEach((a: any) => {
            csv += [
              a.id,
              a.veiculo?.pessoa?.nome || '',
              a.veiculo?.placa || '',
              a.entrada ? new Date(a.entrada).toLocaleString() : '',
              a.saida ? new Date(a.saida).toLocaleString() : '',
              a.observacao ? a.observacao.replace(/\n/g, ' ') : '',
            ]
              .map((v) => '"' + String(v).replace(/"/g, '""') + '"')
              .join(';') + '\n';
          });
        } else if (typeof data === 'string') {
          csv = data;
        } else {
          this.toastService.show('Formato de dados inválido para exportação.', 'danger');
          return;
        }
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'acessos.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erro ao exportar dados:', error);
        this.toastService.show('Erro ao exportar dados. Tente novamente mais tarde.',"danger");
      },
      complete: () => {
        this.toastService.show('Exportação concluída com sucesso.',"success");
      },
    });
  }
}
