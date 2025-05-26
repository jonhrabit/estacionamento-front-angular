import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  imports:[ReactiveFormsModule]
})
export class AlterarSenhaComponent {
  senhaForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder) {
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

      console.log('Enviando alteração de senha:', senhaAtual, novaSenha);
      this.activeModal.close();
    }
  }
}
