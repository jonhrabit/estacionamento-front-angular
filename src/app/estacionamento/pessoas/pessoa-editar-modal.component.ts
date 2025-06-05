import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pessoa } from '../pessoa';

@Component({
  selector: 'app-pessoa-editar-modal',
  templateUrl: './pessoa-editar-modal.component.html',
  imports: [CommonModule, FormsModule],
})
export class PessoaEditarModalComponent {
  @Input() pessoa: Pessoa = {
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

  errorMsg: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  salvar() {
    this.errorMsg = '';
    if (!this.pessoa.nome || !this.pessoa.email) {
      this.errorMsg = 'Preencha todos os campos obrigatórios.';
      return;
    }
    this.activeModal.close(this.pessoa);
  }

  cancelar() {
    this.activeModal.dismiss('cancel');
  }
}
