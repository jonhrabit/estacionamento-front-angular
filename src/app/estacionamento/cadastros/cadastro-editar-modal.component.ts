import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cadastro } from '../cadastro';

@Component({
  selector: 'app-cadastro-editar-modal',
  templateUrl: './cadastro-editar-modal.component.html',
  imports: [CommonModule, FormsModule],
})
export class CadastroEditarModalComponent {
  @Input() cadastro: Cadastro = {
    idPessoa: 0,
    nome: '',
    numFunc: '',
    tipoVinculo: '',
    cargo: '',
    fgOuCc: '',
    lotacao: '',
    ramal: '',
    email: '',
    placa: '',
    modelo: '',
    cor: '',
    foto: '',
    temporario: false,
    dataLimite: null as any
  };
  errorMsg: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  salvar() {
    this.errorMsg = '';
    if (!this.cadastro.nome || !this.cadastro.placa) {
      this.errorMsg = 'Preencha os campos obrigatórios.';
      return;
    }
    this.activeModal.close(this.cadastro);
  }

  cancelar() {
    this.activeModal.dismiss('cancel');
  }
}
