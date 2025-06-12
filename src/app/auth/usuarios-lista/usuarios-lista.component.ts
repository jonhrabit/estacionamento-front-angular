import { ToastService } from './../../shared/toast-global/toast.service';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../interfaces/usuario';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioEditarModalComponent } from '../usuarios-editar-modal/usuario-editar-modal.component';

@Component({
  selector: 'app-usuarios-lista',
  templateUrl: './usuarios-lista.component.html',
  imports: [CommonModule],
})
export class UsuariosListaComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  error = '';
  colunaOrdenacao: string = 'id';
  direcaoOrdenacao: 'asc' | 'desc' = 'asc';

  constructor(private usuarioService: UsuarioService, private modalService: NgbModal, private toast:ToastService) { }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.loading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.ordenarUsuarios();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar usuários';
        this.loading = false;
      }
    });
  }

  abrirModalEdicao(usuario: Usuario) {
    const modalRef = this.modalService.open(UsuarioEditarModalComponent, { size: 'lg' });
    modalRef.componentInstance.usuario = { ...usuario };
    modalRef.result.then((result) => {
      if (result) { // Verifica o resultado do modal
        // Aqui você pode chamar o service para atualizar o usuário
        this.usuarioService.updateUsuario(result.id, result).subscribe(() => {
          // Atualiza a lista após edição
          const idx = this.usuarios.findIndex(u => u.id === result.id);
          if (idx > -1) this.usuarios[idx] = result;
        });
      }
    }, () => {});
  }

  excluirUsuario(usuario: Usuario) {
    if (window.confirm(`Deseja realmente excluir o usuário ${usuario.nome}?`)) {
      if(usuario.id === 1) {
        this.error = 'Usuário administrador não pode ser excluído.';
        return;
      }
      if (usuario.id != undefined) {
        // Chama o serviço para excluir o usuário
        this.usuarioService.deleteUsuario(usuario.id).subscribe({
          next: () => {
            this.toast.show('Usuário excluído com sucesso!', 'success');
            this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);
          },
          error: () => {
            this.error = 'Erro ao excluir usuário.';
          },
        });
      }
    }
  }

  novoUsuario() {
    const modalRef = this.modalService.open(UsuarioEditarModalComponent, { size: 'lg' });
    modalRef.componentInstance.usuario = {
      id: 0,
      nome: '',
      username: '',
      password: '',
      email: '',
      cpf: '',
      cadastro: new Date(),
      permissoes: []
    };
    modalRef.result.then((result:Usuario) => {
      if (result) {
        delete result.id; // Remover o ID para novo usuário
        this.usuarioService.createUsuario(result).subscribe({
         next: (data) => {
          this.toast.show('Usuário criado com sucesso!', 'success');
          this.usuarios.push(data); // Adiciona o novo usuário à lista
         this.loading = false;
         },
         error: (erro) => {
          console.log(erro)
          this.toast.show(erro.error.text, 'danger');
        },
         complete: () => {

         },
        });
      }
    }, () => {});
  }

  resetarSenhaUsuario(usuario: Usuario) {
    if (window.confirm(`Deseja realmente resetar a senha do usuário ${usuario.nome}?`)) {
      if (usuario.id != undefined) {
        this.usuarioService.passwordResetUsuario(usuario.id).subscribe({
          next: () => {
            this.toast.show('Senha resetada com sucesso!', 'success');
          },
          error: (erro) => {
            this.toast.show('Erro ao resetar senha.', 'danger');
          }
        });
      }
    }
  }

  ordenarUsuarios() {
    const col = this.colunaOrdenacao;
    const dir = this.direcaoOrdenacao === 'asc' ? 1 : -1;
    this.usuarios.sort((a: any, b: any) => {
      let valA = a[col];
      let valB = b[col];
      if (col === 'cadastro') {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
  }

  setOrdenacao(coluna: string) {
    if (this.colunaOrdenacao === coluna) {
      this.direcaoOrdenacao = this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenacao = coluna;
      this.direcaoOrdenacao = 'asc';
    }
    this.ordenarUsuarios();
  }
}
