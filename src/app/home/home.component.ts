import { Component, OnInit } from '@angular/core';
import { BotaoMenuComponent } from './botao-menu/botao-menu.component';
import { AcessoService } from '../estacionamento/services/acesso.service';
import { CommonModule } from '@angular/common';
import { Acesso } from '../estacionamento/acesso';
import { InputplacaComponent } from './inputplaca.component';
import { ToastService } from '../shared/toast-global/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcessoEditarModalComponent } from '../estacionamento/acessos/acesso-editar-modal.component';

@Component({
  selector: 'app-home',
  imports: [BotaoMenuComponent, CommonModule, InputplacaComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  acessos: Acesso[] = [];
  colunaOrdenacao: string = 'entrada';
  direcaoOrdenacao: 'asc' | 'desc' = 'desc';

  constructor(
    private acessoService: AcessoService,
    private toastSevice: ToastService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.acessoService.getSaida().subscribe({
      next: (data) => {
        this.acessos = data;
        this.ordenarAcessos();
      },
      error: (erro) => {
        console.error(erro);
      },
      complete: () => {},
    });
  }

  addAcesso(acesso: Acesso): void {
    this.acessos.push(acesso);
    this.ordenarAcessos();
  }

  ordenarAcessos() {
    const col = this.colunaOrdenacao;
    const dir = this.direcaoOrdenacao === 'asc' ? 1 : -1;
    this.acessos.sort((a: any, b: any) => {
      let valA = a[col];
      let valB = b[col];
      // Para datas, converte para timestamp
      if (col === 'entrada' || col === 'saida') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }
      // Para veiculo.placa
      if (col === 'veiculo') {
        valA = a.veiculo?.placa || '';
        valB = b.veiculo?.placa || '';
      }
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  }

  setOrdenacao(coluna: string) {
    if (this.colunaOrdenacao === coluna) {
      this.direcaoOrdenacao = this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenacao = coluna;
      this.direcaoOrdenacao = 'asc';
    }
    this.ordenarAcessos();
  }

  registrarSaida(acesso: Acesso) {
    if (!acesso || !acesso.id) {
      this.toastSevice.show(
        'Acesso inválido. Verifique os dados e tente novamente.',
        'danger'
      );
      return;
    }
    this.acessoService.setSaida(acesso.id).subscribe({
      next: (data) => {
        this.toastSevice.show('Saída registrada com sucesso!', 'success');
        this.ngOnInit()
      },
      error: (erro) => {
        console.error(erro);
        this.toastSevice.show(
          'Erro ao registrar saída. Verifique os dados e tente novamente.',
          'danger'
        );
      },
      complete: () => {},
    });
  }
  abrirModalEdicao(acesso: any) {
    const modalRef = this.modalService.open(AcessoEditarModalComponent, { size: 'lg' });
    modalRef.componentInstance.acesso = { ...acesso };
    modalRef.result.then((result) => {
      if (result) {
        this.acessoService.update(result.id, result).subscribe(() => this.ngOnInit());
      }
    }, () => {});
  }
}
