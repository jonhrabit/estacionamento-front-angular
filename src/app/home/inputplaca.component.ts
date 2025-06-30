import { ToastService } from './../shared/toast-global/toast.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { ClockComponent } from '../shared/clock/clock.component';
import { VeiculoService } from '../estacionamento/services/veiculo.service';
import { Veiculo } from '../estacionamento/veiculo';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AcessoService } from '../estacionamento/services/acesso.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CadastroEditarModalComponent } from '../estacionamento/cadastros/cadastro-editar-modal.component';
import { CadastroService } from '../estacionamento/services/cadastro.service';

@Component({
  selector: 'app-inputplaca',
  imports: [ClockComponent, FormsModule, CommonModule],
  template: `
    <div class="row">
      <div class="col-md-6 d-flex justify-content-center mt-2">
        <input
          type="text"
          name="placa-acesso"
          class="form-control w-100 text-center fs-1"
          placeholder="placa"
          [(ngModel)]="placa"
          (input)="buscarVeiculo()"
        />
      </div>
      <div class="col-md-6 mt-2">
        <app-clock></app-clock>
      </div>
    </div>
    @if(veiculoEncontrado) { @switch (this.statusVeiculoLocalizado()) { @case
    ("ok") {
    <div class="alert alert-info mt-4 text-center">
      <div class="row">
        <div class="col-md-6 fs-3">
          Placa <b>{{ veiculoEncontrado.placa }}</b
          ><br />
          {{ veiculoEncontrado.pessoa.nome }}<br />
          {{ veiculoEncontrado.pessoa.cargo }} <br />
          {{ veiculoEncontrado.pessoa.lotacao }}
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

    } @case ("desativado") {
    <div class="alert alert-danger mt-4 text-center">
      <div class="row">
        <div class="col-md-6 fs-3">
          Placa <b>{{ veiculoEncontrado.placa }}</b
          ><br />
          {{ veiculoEncontrado.pessoa.nome }}<br />
          {{ veiculoEncontrado.pessoa.cargo }} <br />
          {{ veiculoEncontrado.pessoa.lotacao }}
        </div>
        <div class="col-md-6">
          <div class="fs-3">Veículo INATIVO</div>
        </div>
      </div>
    </div>

    } @case ("antecipado") {
    <div class="alert alert-warning mt-4 text-center">
      <div class="row">
        <div class="col-md-6 fs-3">
          Placa <b>{{ veiculoEncontrado.placa }}</b
          ><br />
          {{ veiculoEncontrado.pessoa.nome }}<br />
          {{ veiculoEncontrado.pessoa.cargo }} <br />
          {{ veiculoEncontrado.pessoa.lotacao }}
        </div>
        <div class="col-md-6">
          <div class="fs-3">Veículo ANTECIPADO</div>
          <div class="fs-3">{{ veiculoEncontrado.horario }}</div>

          <input
            type="text"
            class="form-control mb-2"
            placeholder="Observação (opcional)"
            [(ngModel)]="observacao"
            name="observacao"
          />
          <button
            class="btn btn-warning w-100"
            (click)="registrarAcessoDialogo()"
          >
            Registrar Acesso
          </button>
        </div>
      </div>
    </div>

    } @case ("vencido") {
    <div class="alert alert-danger mt-4 text-center">
      <div class="row">
        <div class="col-md-6 fs-3">
          Placa <b>{{ veiculoEncontrado.placa }}</b
          ><br />
          {{ veiculoEncontrado.pessoa.nome }}<br />
          {{ veiculoEncontrado.pessoa.cargo }} <br />
          {{ veiculoEncontrado.pessoa.lotacao }}
        </div>
        <div class="col-md-6">
          <div class="fs-3">Veículo VENCIDO</div>
          <div class="fs-3">
            {{ veiculoEncontrado.dataLimite | date : 'dd/MM/yyyy' }}
          </div>
        </div>
      </div>
    </div>

    } } }@else{ @if (placa.length == 7) {
    <div class="alert alert-danger mt-4 text-center">
      <div class="row">
        <div class="col-md-6 fs-4">
          <div class="row">
            <div class="col-md-4">
              <img
                src="assets/img/abort.png"
                alt="negado"
                style="max-width: 64px; max-height: 64px;"
              />
            </div>
            <div class="col-md-8">
              Placa {{ placa }}<br /><b>Não</b> Localizada
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <button class="btn btn-danger w-100 h-100" (click)="cadastrar()">
            Cadastrar Veículo
          </button>
        </div>
      </div>
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
    private toastSevice: ToastService,
    private modalService: NgbModal,
    private cadastroService: CadastroService
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

  registrarAcessoDialogo() {
    if (
      window.confirm(
        'Deseja realmente registrar o acesso para este veículo ANTECIPADO?'
      )
    ) {
      this.registrarAcesso();
    }
  }

  cadastrar() {
    const modalRef = this.modalService.open(CadastroEditarModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.cadastro = {
      idPessoa: 0,
      nome: '',
      numFunc: '',
      tipoVinculo: '',
      cargo: '',
      fgOuCc: '',
      lotacao: '',
      ramal: '',
      email: '',
      placa: this.placa,
      modelo: '',
      cor: '',
      foto: '',
      ativo: false,
      dataLimite: null,
    };
    modalRef.result.then(
      (result) => {
        if (result) {
          this.cadastroService.create(result).subscribe({
            next: (data) => {
              this.toastSevice.show(
                'Cadastro realizado com sucesso!',
                'success'
              ),
                this.acessoRegistrado.emit(data); // Notifica o componente pai
              this.placa = '';
              this.veiculoEncontrado = null;
              this.observacao = '';
            },

            error: (error) => {
              console.error(error);
              this.toastSevice.show(
                'Erro ao cadastrar:\n' + error.message,
                'danger'
              );
            },
            complete: () => {},
          });

          //this.toastSevice.show('Cadastro realizado com sucesso!', 'success');
          this.placa = '';
        }
      },
      () => {}
    );
  }

  compararDatas(data1: Date | string, data2?: Date | string): number {
    if (data2 == null) {
      data2 = new Date();
    }
    const d1 = new Date(data1);
    const d2 = new Date(data2);
    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
  }

  /**
   * Compara um horário no formato 'HH:mm' com um Date.
   * @returns -1 se horario1 < horario2, 0 se iguais, 1 se horario1 > horario2
   */
  public compararHorarios(horario1: string, horario2?: string | Date): number {
    // Extrai horas e minutos do primeiro horário (string)

    const [h1, m1] = horario1.split(':').map(Number);

    if (!horario2) {
      horario2 = new Date();
    }

    // Extrai horas e minutos do segundo horário (Date ou string)
    let h2: number, m2: number;
    if (horario2 instanceof Date) {
      h2 = horario2.getHours();
      m2 = horario2.getMinutes();
    } else {
      [h2, m2] = horario2.split(':').map(Number);
    }

    if (h1 < h2) return -1;
    if (h1 > h2) return 1;
    if (m1 < m2) return -1;
    if (m1 > m2) return 1;
    return 0;
  }

  statusVeiculoLocalizado(): string {
    if (this.veiculoEncontrado?.ativo == false) {
      return 'desativado';
    }
    if (this.veiculoEncontrado?.dataLimite) {
      if (this.compararDatas(this.veiculoEncontrado?.dataLimite) == -1) {
        return 'vencido';
      }
    }
    if (this.veiculoEncontrado?.horario) {
      if (this.compararHorarios(this.veiculoEncontrado?.horario) == 1) {
        return 'antecipado';
      }
    }
    return 'ok';
  }
}
