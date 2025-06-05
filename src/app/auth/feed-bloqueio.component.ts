import { Component } from '@angular/core';

@Component({
  selector: 'app-feed-bloqueio',
  template: `
    <div class="container mt-5">
      <div class="alert alert-danger text-center">
        <h2>Acesso Bloqueado</h2>
        <p>Seu acesso foi bloqueado ou expirou. Faça login novamente para continuar.</p>
      </div>
    </div>
  `
})
export class FeedBloqueioComponent {}
