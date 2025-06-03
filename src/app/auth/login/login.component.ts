import { Component } from '@angular/core';
import  { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/toast-global/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private authService: AuthService, private toast: ToastService) { }
  username: string = '';
  password: string = '';
  loginError: string = '';

  onSubmit(): void {
    this.loginError = '';
    this.authService.login({username: this.username, password: this.password}).subscribe({
     next: (data) => {},
     error: (erro) => {
        this.loginError = 'Usuário ou senha inválidos!';
     },
     complete: () => {},
    });
  }

}
