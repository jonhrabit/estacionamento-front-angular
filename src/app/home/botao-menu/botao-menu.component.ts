import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-botao-menu',
  imports: [RouterLink],
  template: `<button
    class="btn btn-outline-dark p-0 m-2"
    style="width: 100px; height: 100px;"
    [routerLink]="link"
  >
    <h1 class="p-0 m-0"><i [className]="icone"></i></h1>
    {{ texto }}
  </button>`,
})
export class BotaoMenuComponent {
  @Input() link: string = '';
  @Input() icone: string = '';
  @Input() texto: string = '';
}
