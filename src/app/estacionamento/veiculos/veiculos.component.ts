import { Component, OnInit } from '@angular/core';
import { VeiculoService } from '../services/veiculo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VeiculoEditarModalComponent } from './veiculo-editar-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../shared/toast-global/toast.service';

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.component.html',
  imports: [CommonModule, FormsModule],
})
export class VeiculosComponent implements OnInit {
  veiculos: any[] = [];
  veiculosFiltrados: any[] = [];
  filtro: string = '';
  filtroProprietario: string = '';
  filtroCargo: string = '';
  filtroLotacao: string = '';
  paginaAtual = 1;
  itensPorPagina = 25;
  colunaOrdenacao: string = '';
  direcaoOrdenacao: 'asc' | 'desc' = 'asc';

  constructor(
    private veiculoService: VeiculoService,
    private modalService: NgbModal,
    private toastService: ToastService
  ) {}

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
    const termo = this.filtro.toLowerCase();
    this.veiculosFiltrados = this.veiculos.filter(
      (v) =>
        v.placa.toLowerCase().includes(termo) ||
        v.modelo.toLowerCase().includes(termo) ||
        (v.pessoa?.nome && v.pessoa.nome.toLowerCase().includes(termo)) ||
        (v.pessoa?.cargo && v.pessoa.cargo.toLowerCase().includes(termo)) ||
        (v.pessoa?.lotacao && v.pessoa.lotacao.toLowerCase().includes(termo))
    );
    this.paginaAtual = 1;
    if (this.colunaOrdenacao) {
      this.ordenarVeiculos();
    }
  }

  ordenarPor(coluna: string) {
    if (this.colunaOrdenacao === coluna) {
      this.direcaoOrdenacao = this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenacao = coluna;
      this.direcaoOrdenacao = 'asc';
    }
    this.ordenarVeiculos();
  }

  ordenarVeiculos() {
    this.veiculosFiltrados.sort((a, b) => {
      let valorA, valorB;
      switch (this.colunaOrdenacao) {
        case 'id':
          valorA = a.id;
          valorB = b.id;
          break;
        case 'placa':
          valorA = a.placa || '';
          valorB = b.placa || '';
          break;
        case 'modelo':
          valorA = a.modelo || '';
          valorB = b.modelo || '';
          break;
        case 'cor':
          valorA = a.cor || '';
          valorB = b.cor || '';
          break;
        case 'proprietario':
          valorA = a.pessoa?.nome || '';
          valorB = b.pessoa?.nome || '';
          break;
        case 'cargo':
          valorA = a.pessoa?.cargo || '';
          valorB = b.pessoa?.cargo || '';
          break;
        case 'lotacao':
          valorA = a.pessoa?.lotacao || '';
          valorB = b.pessoa?.lotacao || '';
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

  get veiculosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.veiculosFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.veiculosFiltrados.length / this.itensPorPagina);
  }

  abrirModalEdicao(veiculo: any) {
    const modalRef = this.modalService.open(VeiculoEditarModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.veiculo = { ...veiculo };
    modalRef.result.then(
      (result) => {
        if (result) {
          this.veiculoService.update(result.id, result).subscribe(() => {
            this.carregarVeiculos();
            this.toastService.show('Veículo salvo com sucesso.', 'success');
          });
        }
      },
      () => {}
    );
  }

  excluirVeiculo(veiculo: any) {
    if (
      window.confirm(`Deseja realmente excluir o veículo ${veiculo.placa}?`)
    ) {
      this.veiculoService
        .delete(veiculo.id)
        .subscribe(() => this.carregarVeiculos());
    }
  }

  novoVeiculo() {
    const modalRef = this.modalService.open(VeiculoEditarModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.veiculo = {
      id: 0,
      placa: '',
      modelo: '',
      cor: '',
      ano: '',
      ativo:true,
      pessoaId: null,
    };
    modalRef.result.then(
      (result) => {
        if (result) {
          delete result.id;
          this.veiculoService
            .create(result)
            .subscribe(() => this.carregarVeiculos());
        }
      },
      () => {}
    );
  }
  formatar(data : Date){
    console.log(data);

    let ano = data.getFullYear();
    let mes:number = data.getMonth()+1;
    let mesString=mes>9?mes:"0"+mes;

    let dia = data.getDate();
    let diaString=dia>9?dia:"0"+dia;

    console.log(ano + '-' + mesString + '-' + diaString);

    return ano+"-"+mesString+"-"+diaString;
  }
}
