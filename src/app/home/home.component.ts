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
  constructor(
    private acessoService: AcessoService,
    private toastSevice: ToastService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.acessoService.getSaida().subscribe({
      next: (data) => {
        this.acessos = data;
        this.ordenarAcessosPorDataDesc();
      },
      error: (erro) => {
        console.error(erro);
      },
      complete: () => {},
    });
  }

  addAcesso(acesso: Acesso): void {
    this.acessos.push(acesso);
    this.ordenarAcessosPorDataDesc();
  }

  ordenarAcessosPorDataDesc() {
    this.acessos.sort((a, b) => {
      const dataA = new Date(a.entrada).getTime();
      const dataB = new Date(b.entrada).getTime();
      return dataB - dataA;
    });
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
