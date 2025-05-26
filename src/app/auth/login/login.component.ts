import { Component } from '@angular/core';
import  { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private authService: AuthService) { }
  username: string = '';
  password: string = '';
  onSubmit(): void {
    console.log('Form submitted with:', { username: this.username, password: this.password });
    this.authService.login({username: this.username, password: this.password}).subscribe({
     next: (data) => {},
     error: (erro) => {
    console.error(erro);
    },
     complete: () => {},
    });


  }

}
