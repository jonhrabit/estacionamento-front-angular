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

  constructor(
    private pessoaService: PessoaService,
    private modalService: NgbModal
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
    const modalRef = this.modalService.open(PessoaEditarModalComponent, { size: 'lg' });
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
      veiculos: []
    };
    modalRef.result.then((result) => {
      if (result) {
        delete result.id;
        this.pessoaService.create(result).subscribe(() => this.carregarPessoas());
      }
    }, () => {});
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
