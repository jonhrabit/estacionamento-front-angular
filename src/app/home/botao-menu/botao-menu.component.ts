import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-botao-menu',
  imports: [RouterLink],
  templateUrl: './botao-menu.component.html',
})
export class BotaoMenuComponent {
  @Input() link: string = '';
  @Input() icone: string = '';
  @Input() texto: string = '';
}
