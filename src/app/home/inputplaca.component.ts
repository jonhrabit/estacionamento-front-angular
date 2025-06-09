import { ToastService } from './../shared/toast-global/toast.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { ClockComponent } from '../shared/clock/clock.component';
import { VeiculoService } from '../estacionamento/services/veiculo.service';
import { Veiculo } from '../estacionamento/veiculo';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AcessoService } from '../estacionamento/services/acesso.service';
import { Acesso } from '../estacionamento/acesso';

@Component({
  selector: 'app-inputplaca',
  imports: [ClockComponent, FormsModule, CommonModule],
  template: `
    <div class="row">
      <div class="col-md-6 d-flex justify-content-center mt-2">
        <input
          type="text"
          name="placa-acesso"
          class="form-control w-100 text-center"
          placeholder="Registrar entrada-> Placa do veículo"
          [(ngModel)]="placa"
          (input)="buscarVeiculo()"
        />
      </div>
      <div class="col-md-6 mt-2">
        <app-clock></app-clock>
      </div>
    </div>
    @if (veiculoEncontrado) {
    <div class="alert alert-info mt-4 text-center">
      <div class="row">
        <div class="col-md-6">
          Veículo: {{ veiculoEncontrado.placa }} -
          {{ veiculoEncontrado.pessoa.nome }}
        </div>
        <div class="col-md-6">
          <input
            type="text"
            class="form-control mb-2"
            placeholder="Observação (opcional)"
            [(ngModel)]="observacao"
            name="observacao"
          />
          <button class="btn btn-success w-100" (click)="registrarAcesso()">
            Registrar Acesso
          </button>
        </div>
      </div>
    </div>
    }@else{ @if (placa.length == 7) {
    <div class="alert alert-danger mt-4 text-center">
      Veiculo: {{ placa }} - não Localizado.
    </div>
    } }
  `,
})
export class InputplacaComponent {
  placa: string = '';
  veiculoEncontrado: Veiculo | null = null;
  observacao: string = '';
  @Output() acessoRegistrado = new EventEmitter<any>();

  constructor(
    private veiculoService: VeiculoService,
    private acessoService: AcessoService,
    private toastSevice: ToastService
  ) {}

  buscarVeiculo() {
    if (this.placa && this.placa.length == 7) {
      this.veiculoService.getAll().subscribe((veiculos) => {
        this.veiculoEncontrado =
          veiculos.find(
            (v: Veiculo) => v.placa.toLowerCase() === this.placa.toLowerCase()
          ) || null;
      });
    } else {
      this.veiculoEncontrado = null;
    }
  }

  registrarAcesso() {
    if (!this.veiculoEncontrado) {
      this.toastSevice.show(
        'Veículo não encontrado. Verifique a placa e tente novamente.',
        'danger'
      );
      return;
    }
    if (this.veiculoEncontrado) {
      this.acessoService
        .createById(this.veiculoEncontrado.id, this.observacao)
        .subscribe({
          next: (data) => {
            this.toastSevice.show('Acesso registrado com sucesso!', 'success');
            this.acessoRegistrado.emit(data); // Notifica o componente pai
            this.placa = '';
            this.veiculoEncontrado = null;
            this.observacao = '';
          },
          error: (erro) => {
            console.error(erro);
            this.toastSevice.show(
              'Erro ao registrar acesso. Verifique os dados e tente novamente.',
              'danger'
            );
          },
          complete: () => {},
        });
    }
  }

}
