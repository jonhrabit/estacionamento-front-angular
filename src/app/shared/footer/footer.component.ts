import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    @if (isLogado()) {
    <footer class="py-4 bg-ligth text-center d-print-none">
      <div class="container">
        <p class="mb-0">
          &copy; 2025 Estacionamento. Todos os direitos reservados.
        </p>
        <p class="mb-0">Contato: xavier.tjrs&#64;gmail.com</p>
      </div>
    </footer>
    }
  `,
})
export class FooterComponent {
  constructor(private authservice: AuthService) {}
  isLogado() {
    return this.authservice.isLoggedIn();
  }
}
