import { ToastService } from './../../shared/toast-global/toast.service';
import { Component, OnInit } from '@angular/core';
import { PessoaService } from '../services/pessoa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PessoaEditarModalComponent } from './pessoa-editar-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pessoas',
  templateUrl: './pessoas.component.html',
  imports: [CommonModule, FormsModule],
})
export class PessoasComponent implements OnInit {
  pessoas: any[] = [];
  pessoasFiltradas: any[] = [];
  filtro: string = '';
  paginaAtual = 1;
  itensPorPagina = 10;
  colunaOrdenacao: string = '';
  direcaoOrdenacao: 'asc' | 'desc' = 'asc';

  constructor(
    private pessoaService: PessoaService,
    private modalService: NgbModal,
    private ToastService: ToastService
  ) {}

  ngOnInit(): void {
    this.carregarPessoas();
  }

  carregarPessoas() {
    this.pessoaService.getAll().subscribe((data) => {
      this.pessoas = data;
      this.aplicarFiltro();
    });
  }

  aplicarFiltro() {
    this.pessoasFiltradas = this.pessoas.filter((p) =>
      p.nome.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.paginaAtual = 1;
    if (this.colunaOrdenacao) {
      this.ordenarPessoas();
    }
  }

  ordenarPor(coluna: string) {
    if (this.colunaOrdenacao === coluna) {
      this.direcaoOrdenacao = this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenacao = coluna;
      this.direcaoOrdenacao = 'asc';
    }
    this.ordenarPessoas();
  }

  ordenarPessoas() {
    this.pessoasFiltradas.sort((a, b) => {
      let valorA, valorB;
      switch (this.colunaOrdenacao) {
        case 'id':
          valorA = a.id;
          valorB = b.id;
          break;
        case 'nome':
          valorA = a.nome || '';
          valorB = b.nome || '';
          break;
        case 'numFunc':
          valorA = a.numFunc || '';
          valorB = b.numFunc || '';
          break;
        case 'cargo':
          valorA = a.cargo || a.fgOuCc || '';
          valorB = b.cargo || b.fgOuCc || '';
          break;
        case 'lotacao':
          valorA = a.lotacao || '';
          valorB = b.lotacao || '';
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

  get pessoasPaginadas() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.pessoasFiltradas.slice(inicio, inicio + this.itensPorPagina);
  }

  abrirModalEdicao(pessoa: any) {
    const modalRef = this.modalService.open(PessoaEditarModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.pessoa = { ...pessoa };
    modalRef.result.then(
      (result) => {
        if (result) {
          // Atualizar pessoa
          this.pessoaService
            .update(result.id, result)
            .subscribe(() => this.carregarPessoas());
        }
      },
      () => {}
    );
  }

  excluirPessoa(pessoa: any) {
    if (window.confirm(`Deseja realmente excluir ${pessoa.nome}?`)) {
      this.pessoaService
        .delete(pessoa.id)
        .subscribe(() => this.carregarPessoas());
    }
  }

  novaPessoa() {
    const modalRef = this.modalService.open(PessoaEditarModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.pessoa = {
      id: 0,
      nome: '',
      numFunc: '',
      tipoVinculo: '',
      cargo: '',
      fgOuCc: '',
      lotacao: '',
      ramal: '',
      email: '',
      veiculos: [],
    };
    modalRef.result.then((result) => {
      if (result) {
        delete result.id;
        this.pessoaService.create(result).subscribe({
          next: () => this.carregarPessoas(),
          error: (error) =>
            this.ToastService.show(
              'Erro ao criar nova pessoa:\n' + error.message,
              'danger'
            ),
          complete: () => {
            this.ToastService.show('Pessoa criada com sucesso!', 'success');
          },
        });
      }
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.pessoasFiltradas.length / this.itensPorPagina);
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
}
