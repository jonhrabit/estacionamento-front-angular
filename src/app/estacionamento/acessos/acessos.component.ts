import { Component, OnInit } from '@angular/core';
import { AcessoService } from '../services/acesso.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcessoEditarModalComponent } from './acesso-editar-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private acessoService: AcessoService, private modalService: NgbModal) {}

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
    this.acessosFiltrados = this.acessos.filter(a =>
      (a.pessoa?.nome?.toLowerCase().includes(this.filtro.toLowerCase()) ||
       a.veiculo?.placa?.toLowerCase().includes(this.filtro.toLowerCase()) ||
       a.observacao?.toLowerCase().includes(this.filtro.toLowerCase()))
    );
    this.paginaAtual = 1;
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
    const modalRef = this.modalService.open(AcessoEditarModalComponent, { size: 'lg' });
    modalRef.componentInstance.acesso = { ...acesso };
    modalRef.result.then((result) => {
      if (result) {
        this.acessoService.update(result.id, result).subscribe(() => this.carregarAcessos());
      }
    }, () => {});
  }

  excluirAcesso(acesso: any) {
    if (window.confirm(`Deseja realmente excluir o acesso de ${acesso.pessoa?.nome || ''}?`)) {
      this.acessoService.delete(acesso.id).subscribe(() => this.carregarAcessos());
    }
  }

  novoAcesso() {
    const modalRef = this.modalService.open(AcessoEditarModalComponent, { size: 'lg' });
    modalRef.componentInstance.acesso = {
      veiculo: null,
      entrada: '',
      saida: '',
      observacao: '',
    };

    modalRef.result.then((result) => {
      if (result) {
        delete result.veiculo.pessoa;
        delete result.id;
        this.acessoService.create(result).subscribe(() => this.carregarAcessos());
      }
    }, () => {});
  }
}
