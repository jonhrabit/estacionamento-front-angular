import { Component, OnInit } from '@angular/core';
import { VeiculoService } from '../services/veiculo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VeiculoEditarModalComponent } from './veiculo-editar-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.component.html',
  imports: [CommonModule, FormsModule],
})
export class VeiculosComponent implements OnInit {
  veiculos: any[] = [];
  veiculosFiltrados: any[] = [];
  filtro: string = '';
  paginaAtual = 1;
  itensPorPagina = 10;

  constructor(private veiculoService: VeiculoService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos() {
    this.veiculoService.getAll().subscribe((data) => {
      this.veiculos = data;
      this.aplicarFiltro();
    });
  }

  aplicarFiltro() {
    this.veiculosFiltrados = this.veiculos.filter(v =>
      v.placa.toLowerCase().includes(this.filtro.toLowerCase()) ||
      v.modelo.toLowerCase().includes(this.filtro.toLowerCase())
    );
    this.paginaAtual = 1;
  }

  get veiculosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.veiculosFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.veiculosFiltrados.length / this.itensPorPagina);
  }

  abrirModalEdicao(veiculo: any) {
    const modalRef = this.modalService.open(VeiculoEditarModalComponent, { size: 'lg' });
    modalRef.componentInstance.veiculo = { ...veiculo };
    modalRef.result.then((result) => {
      if (result) {
        this.veiculoService.update(result.id, result).subscribe(() => this.carregarVeiculos());
      }
    }, () => {});
  }

  excluirVeiculo(veiculo: any) {
    if (window.confirm(`Deseja realmente excluir o veículo ${veiculo.placa}?`)) {
      this.veiculoService.delete(veiculo.id).subscribe(() => this.carregarVeiculos());
    }
  }

  novoVeiculo() {
    const modalRef = this.modalService.open(VeiculoEditarModalComponent, { size: 'lg' });
    modalRef.componentInstance.veiculo = {
      id: 0,
      placa: '',
      modelo: '',
      cor: '',
      ano: '',
      pessoaId: null
    };
    modalRef.result.then((result) => {
      if (result) {
        delete result.id;
        this.veiculoService.create(result).subscribe(() => this.carregarVeiculos());
      }
    }, () => {});
  }
}
