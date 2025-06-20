import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cadastro } from '../cadastro';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { PessoaService } from '../services/pessoa.service';

@Component({
  selector: 'app-cadastro-editar-modal',
  templateUrl: './cadastro-editar-modal.component.html',
  imports: [CommonModule, FormsModule, NgbTypeaheadModule],
})
export class CadastroEditarModalComponent implements OnInit {
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
    dataLimite: null as any,
  };
  errorMsg: string = '';
  pessoas: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private pessoaservice: PessoaService
  ) {}

  ngOnInit(): void {
    this.pessoaservice.getAll().subscribe((pessoas) => {
      this.pessoas = pessoas;
    });
  }

  salvar() {
    this.errorMsg = '';
    if (
      !this.cadastro.nome ||
      !this.cadastro.placa ||
      !this.cadastro.tipoVinculo
    ) {
      this.errorMsg = 'Preencha os campos obrigatórios.';
      return;
    }
    // Garante que o campo nome seja apenas o nome, não o objeto

    let pessoa: any = this.cadastro.nome;
    this.cadastro.nome = pessoa.nome;
    this.activeModal.close(this.cadastro);
  }

  cancelar() {
    this.activeModal.dismiss('cancel');
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

  onPessoaSelecionada(pessoa: any) {
    if (pessoa) {
      this.cadastro.idPessoa = pessoa.id;
      this.cadastro.numFunc = pessoa.numFunc;
      this.cadastro.tipoVinculo = pessoa.tipoVinculo;
      this.cadastro.cargo = pessoa.cargo;
      this.cadastro.fgOuCc = pessoa.fgOuCc;
      this.cadastro.lotacao = pessoa.lotacao;
      this.cadastro.ramal = pessoa.ramal;
      this.cadastro.email = pessoa.email;
    }
  }
}
