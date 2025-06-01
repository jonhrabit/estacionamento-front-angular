import { Component } from '@angular/core';
import  { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/toast-global/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private authService: AuthService, private toast: ToastService) { }
  username: string = '';
  password: string = '';
  onSubmit(): void {
    this.authService.login({username: this.username, password: this.password}).subscribe({
     next: (data) => {},
     error: (erro) => {
        console.error(erro);
        this.toast.show('Usuário ou senha inválidos!', 'danger');
     },
     complete: () => {},
    });
  }

}
