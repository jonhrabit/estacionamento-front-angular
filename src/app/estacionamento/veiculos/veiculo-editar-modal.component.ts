import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService } from '../services/pessoa.service';
import { Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-veiculo-editar-modal',
  templateUrl: './veiculo-editar-modal.component.html',
  imports: [CommonModule, FormsModule, NgbTypeaheadModule],
})
export class VeiculoEditarModalComponent implements OnInit {
  @Input() veiculo: any = {
    id: 0,
    placa: '',
    modelo: '',
    cor: '',
    foto: '',
    temporario: false,
    dataLimite: null,
    pessoa: null,
  };

  pessoas: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private pessoaService: PessoaService
  ) {}

  ngOnInit() {
    this.pessoaService
      .getAll()
      .subscribe((pessoas) => (this.pessoas = pessoas));
  }

  searchPessoa = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.pessoas.filter((p) =>
              p.nome.toLowerCase().includes(term.toLowerCase())
            )
      )
    );

  formatterPessoa = (pessoa: any) => (pessoa && pessoa.nome ? pessoa.nome : '');

  salvar() {
    // Salva apenas o id da pessoa selecionada
    if (typeof this.veiculo.pessoaId === 'object' && this.veiculo.pessoaId.id) {
      this.veiculo.pessoaId = this.veiculo.pessoaId.id;
    }
    this.activeModal.close(this.veiculo);
  }

  cancelar() {
    this.activeModal.dismiss('cancel');
  }
}
