import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeiculoService } from '../services/veiculo.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-acesso-editar-modal',
  templateUrl: './acesso-editar-modal.component.html',
  imports: [CommonModule, FormsModule, NgbTypeaheadModule],
})
export class AcessoEditarModalComponent implements OnInit {
  @Input() acesso: any = {
    id: 0,
    veiculo: null,
    entrada: '',
    saida: '',
    observacao: '',
  };

  veiculos: any[] = [];
  errorMsg: string = '';

  constructor(
    public activeModal: NgbActiveModal,
    private veiculoService: VeiculoService
  ) {}

  ngOnInit() {
    this.veiculoService.getAll().subscribe((veiculos) => (this.veiculos = veiculos));

    if (this.acesso.entrada) {
      this.acesso.entrada = this.toInputDateTimeLocal(this.acesso.entrada);
    }
    if (this.acesso.saida) {
      this.acesso.saida = this.toInputDateTimeLocal(this.acesso.saida);
    }
  }

  toInputDateTimeLocal(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  searchVeiculo = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.veiculos.filter((v) =>
              v.placa.toLowerCase().includes(term.toLowerCase())
            )
      )
    );

  formatterVeiculo = (veiculo: any) =>
    veiculo && veiculo.placa ? veiculo.placa : '';
  viewVeiculo = (veiculo: any) =>
    veiculo && veiculo.placa ? veiculo.placa + ' - ' + veiculo.pessoa.nome : '';

  salvar() {
    this.errorMsg = '';
    if (!this.acesso.veiculo || !this.acesso.entrada) {
      this.errorMsg = 'Preencha todos os campos obrigatórios.';
      return;
    }
    if (this.acesso.entrada) {
      this.acesso.entrada = new Date(this.acesso.entrada);
      this.acesso.entrada = new Date(
        this.acesso.entrada.getTime() -
          this.acesso.entrada.getTimezoneOffset() * 60000
      ).toISOString();
    }
    if (this.acesso.saida) {
      this.acesso.saida = new Date(this.acesso.saida);
      this.acesso.saida = new Date(
        this.acesso.saida.getTime() -
          this.acesso.saida.getTimezoneOffset() * 60000
      ).toISOString();
    }
    this.activeModal.close(this.acesso);
  }

  cancelar() {
    this.activeModal.dismiss('cancel');
  }

  setDataAtual(campo: 'entrada' | 'saida') {
    const agora = new Date();
    const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    this.acesso[campo] = local;
  }
}
