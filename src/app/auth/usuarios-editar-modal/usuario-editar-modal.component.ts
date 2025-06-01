import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from '../usuario';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuario-editar-modal',
  templateUrl: './usuario-editar-modal.component.html',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class UsuarioEditarModalComponent {
  @Input() usuario: Usuario = {
    id: 0,
    nome: '',
    username: '',
    password: '',
    email: '',
    cpf: '',
    cadastro: new Date(),
    permissoes: [],
  };

  constructor(public activeModal: NgbActiveModal) {}

  permissoes = ['BASIC','ADMIN'];

  permissaoid(permissao:String):boolean{
    return this.usuario.permissoes?.some((p) => p.nome === permissao);
  }

  salvar() {
    this.activeModal.close(this.usuario);
  }

  cancelar() {
    this.activeModal.dismiss('cancel');
  }

  onPermissaoChange(event: any, permissao: string) {
    if (!this.usuario.permissoes) {
      this.usuario.permissoes = [];
    }
    if (event.target.checked) {
      // Adiciona permissão se não existir
      if (!this.usuario.permissoes.some((p) => p.nome === permissao)) {
        this.usuario.permissoes.push({
          nome: permissao,
          id: null
        });
      }
    } else {
      // Remove permissão se desmarcado
      this.usuario.permissoes = this.usuario.permissoes.filter(
        (p) => p.nome !== permissao
      );
    }
  }
}
