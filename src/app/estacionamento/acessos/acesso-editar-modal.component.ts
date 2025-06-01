import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-acesso-editar-modal',
  templateUrl: './acesso-editar-modal.component.html',
  imports: [CommonModule, FormsModule],
})
export class AcessoEditarModalComponent {
  @Input() acesso: any = {
    id: 0,
    pessoaId: null,
    veiculoId: null,
    dataHoraEntrada: '',
    dataHoraSaida: '',
    observacao: ''
  };

  constructor(public activeModal: NgbActiveModal) {}

  salvar() {
    this.activeModal.close(this.acesso);
  }

  cancelar() {
    this.activeModal.dismiss('cancel');
  }
}
