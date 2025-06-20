import { UsuarioService } from './../usuario.service';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../shared/toast-global/toast.service';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  imports: [ReactiveFormsModule],
})
export class AlterarSenhaComponent {
  senhaForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.senhaForm = this.fb.group(
      {
        senhaAtual: ['', Validators.required],
        novaSenha: ['', [Validators.required, Validators.minLength(6)]],
        confirmarSenha: ['', Validators.required],
      },
      {
        validators: this.matchPasswords,
      }
    );
  }

  matchPasswords(group: FormGroup) {
    const nova = group.get('novaSenha')?.value;
    const conf = group.get('confirmarSenha')?.value;
    return nova === conf ? null : { mismatch: true };
  }

  alterarSenha() {
    if (this.senhaForm.valid) {
      const { senhaAtual, novaSenha } = this.senhaForm.value;

     var user_id = Number(this.authService.getUsuarioLogado()?.usrd);

      this.usuarioService
        .passwordAlterarUsuario(user_id, novaSenha, senhaAtual)
        .subscribe({
          next: () => {
            this.toastService.show(
              'Senha alterada com sucesso!',
              'success'
            );
          },
          error: (err) => {
            console.error('Erro ao alterar senha:', err);
          },
        });

      this.activeModal.close();
    }
  }
}
